'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user?.image) {
      setAvatarUrl(session.user.image);
    }
  }, [session?.user?.image]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!selectedImage) {
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedImage);

    try {
      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.url);
        await update({
          ...session,
          user: {
            ...session?.user,
            image: data.url,
          },
        });
        setIsSaved(true);
        setSelectedImage(null);
      } else {
        console.error('Error uploading avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar', error);
    }
  };

  return (
    <div className="container max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="font-display italic text-3xl sm:text-4xl font-semibold text-foreground mb-8">
        Profile
      </h1>
      {session && session.user && (
        <div className="flex items-center gap-4">
          {/* shrink-0 keeps the photo round when a long name or email needs the space */}
          {(avatarUrl || session.user?.image) && (() => {
            const imageSrc = avatarUrl || session.user!.image!;
            return (
              <Image
                src={imageSrc}
                alt="User Avatar"
                width={96}
                height={96}
                className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-full object-cover"
              />
            );
          })()}
          {!(avatarUrl || session.user?.image) && (
            <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-full bg-muted flex items-center justify-center">
              <span className="font-sans-body text-xs text-muted-foreground">No photo</span>
            </div>
          )}
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold text-foreground break-words">
              {session.user.name}
            </h2>
            <p className="font-sans-body text-sm text-muted-foreground break-all">{session.user.email}</p>
          </div>
        </div>
      )}
      {!isSaved && (
        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-photo">Upload a new photo</Label>
            <Input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>
          {selectedImage && (
            <div className="space-y-2">
              <p className="font-sans-body text-sm text-muted-foreground">Selected photo:</p>
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Image"
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
              />
            </div>
          )}
          <Button onClick={handleSave} disabled={!selectedImage} className="w-full sm:w-auto">
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
