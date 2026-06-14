import TopNavBar from "@/components/TopNavBar";
import InteractiveImageBentoGallery from "@/components/ui/bento-gallery";
import { getGalleryImages, getOptimizedImageUrl } from "@/lib/db";

export const revalidate = 60;

const SPANS = [
  "md:col-span-2 md:row-span-2",
  "md:row-span-1",
  "md:row-span-1",
  "md:row-span-2",
  "md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

export default async function GalleryPage() {
  const images = await getGalleryImages().catch(() => []);

  if (images.length === 0) {
    return (
      <>
        <TopNavBar />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
              photo_library
            </span>
            <h2 className="font-headline text-2xl font-bold text-on-background mb-2">
              Η γκαλερί έρχεται σύντομα
            </h2>
            <p className="text-on-surface-variant font-body">
              Οι εικόνες θα εμφανιστούν εδώ μόλις ανεβαστούν στον πίνακα διαχείρισης.
            </p>
          </div>
        </div>
      </>
    );
  }

  const bentoItems = images.map((img, i) => ({
    id: img.id,
    title: img.alt,
    desc: img.caption ?? "",
    url: getOptimizedImageUrl(img.url, { width: 600, quality: 75 }),
    fullUrl: getOptimizedImageUrl(img.url, { width: 1600, quality: 90 }),
    span: SPANS[i % SPANS.length],
  }));

  return (
    <>
      <TopNavBar />
      <div id="bento-gallery">
        <InteractiveImageBentoGallery
          imageItems={bentoItems}
          title="Επιλεγμένη Συλλογή"
          description="Τοπόσημα που αποτυπώθηκαν στα άκρα του κόσμου. Σύρετε για εξερεύνηση, κάντε κλικ για άνοιγμα."
        />
      </div>
    </>
  );
}
