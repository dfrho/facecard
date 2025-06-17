import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path if your authOptions is elsewhere
import { supabase } from '@/lib/supabaseClient'; // Our Supabase client

// Define a type for the expected profile data for POST requests
// This should align with your ProfileFormData and the columns in your 'profiles' table
interface ProfileInput {
  name?: string;
  bio?: string;
  interests?: string[]; // Or jsonb, adjust as per your schema
  linkedin_url?: string | null;
  github_url?: string | null;
  personal_website_url?: string | null;
  avatar_url?: string | null; // Assuming this is a URL managed elsewhere or set by user
  video_intro_url?: string | null;
  // Add any other fields from your ProfileFormData that you expect to save
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single(); // Use .single() if you expect at most one profile per user

    if (error) {
      if (error.code === 'PGRST116') { // PGRST116: "The result contains 0 rows"
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      console.error('Supabase GET error:', error);
      return NextResponse.json({ error: 'Error fetching profile', details: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Catch GET error:', err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal server error', details: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  let profileData: ProfileInput;

  try {
    profileData = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Ensure user_id in the data being upserted is the authenticated user's ID
  const dataToUpsert = {
    ...profileData,
    user_id: userId,
    updated_at: new Date().toISOString(), // Manage updated_at timestamp
  };

  // If you want to set created_at only on insert, Supabase can handle this
  // with default values or you might need a more complex upsert or separate insert/update logic.
  // For a simple upsert, updated_at is common. Supabase upsert might also need `onConflict('user_id')`.

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(dataToUpsert, {
        onConflict: 'user_id', // Assumes 'user_id' is a unique key or primary key for the upsert.
        // Consider using .eq('user_id', userId) for more traditional update if not using upsert's onConflict.
      })
      .select() // select() after upsert to get the (potentially) updated/inserted row
      .single();


    if (error) {
      console.error('Supabase POST/upsert error:', error);
      return NextResponse.json({ error: 'Error saving profile', details: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 }); // 200 for upsert, or 201 if you distinguish insert
  } catch (err) {
    console.error('Catch POST error:', err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal server error', details: message }, { status: 500 });
  }
}
