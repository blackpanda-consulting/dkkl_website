import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dinesh Kiran Kashi Laabh",
    short_name: "Kashi Laabh",
    description:
      "Long-term twin-sharing accommodation in Kashi for terminally ill and elderly residents.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcf9f2",
    theme_color: "#296569",
    icons: [
      {
        src: "/logos/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logos/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
