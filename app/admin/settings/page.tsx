import { getSiteSetting } from "@/lib/db";
import AboutPageSettings from "./AboutPageSettings";
import HeroImageSetting from "./HeroImageSetting";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [heroImageUrl, aboutPhoto, aboutHeading, aboutBio] = await Promise.all([
    getSiteSetting("hero_image_url"),
    getSiteSetting("about_photo_url"),
    getSiteSetting("about_heading"),
    getSiteSetting("about_bio"),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-headline font-bold text-on-background tracking-tight">
          Site Settings
        </h1>
        <p className="text-sm text-outline font-body mt-1">
          Control global appearance and content.
        </p>
      </div>

      {/* Homepage Hero */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant font-label mb-1">
          Homepage Hero
        </h2>
        <p className="text-sm text-outline font-body mb-4">
          Choose the image shown in the hero scroll section. When left empty,
          the first featured destination&apos;s image is used automatically.
        </p>
        <HeroImageSetting initialUrl={heroImageUrl ?? ""} />
      </div>

      {/* About Page */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant font-label mb-1">
          About Page
        </h2>
        <p className="text-sm text-outline font-body mb-6">
          Portrait photo, heading, and bio text shown on the About page.
        </p>
        <AboutPageSettings
          initialPhotoUrl={aboutPhoto ?? ""}
          initialHeading={aboutHeading ?? ""}
          initialBio={aboutBio ?? ""}
        />
      </div>
    </div>
  );
}
