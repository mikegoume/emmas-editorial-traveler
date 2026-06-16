import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Travel With Emma",
    short_name: "TWE",
    description:
      "Ψηφιακό ημερολόγιο αργού ταξιδιού και editorial φωτογραφίας.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a1a1a",
  };
}
