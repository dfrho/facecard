'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

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
    formData.append('file', selectedImage);

    try {
      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.avatarUrl);
        await update({
          ...session,
          user: {
            ...session?.user,
            image: data.avatarUrl,
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {session && session.user && (
        <div className="flex items-center space-x-4">
          {(avatarUrl || session.user?.image) && (() => {
            const imageSrc = avatarUrl || session.user!.image!;
            return (
              <Image
                src={imageSrc}
                alt="User Avatar"
                width={100}
                height={100}
                className="rounded-full"
              />
            );
          })()}
          {!(avatarUrl || session.user?.image) && (
            <div className="w-[100px] h-[100px] rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">{session.user.name}</h2>
            <p className="text-gray-600">{session.user.email}</p>
          </div>
        </div>
      )}
      {!isSaved && (
        <div className="mt-4">
          <input type="file" onChange={handleImageChange} />
          {selectedImage && (
            <div className="mt-2">
              <p>Selected Image:</p>
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Image"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
          )}
          <div className="mt-4">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
}
