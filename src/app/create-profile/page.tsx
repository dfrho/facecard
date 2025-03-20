import { ExpandedProfileForm } from "@/components/expanded-profile-form";

export default function CreateProfilePage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Your Profile</h1>
          <p className="text-muted-foreground">
            Tell us about yourself and we'll help you create your AI-powered video business card.
          </p>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Step 1: Profile Information</h2>
              <p className="text-sm text-muted-foreground">
                We'll use this information to personalize your video business card.
              </p>
            </div>
            <ExpandedProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}