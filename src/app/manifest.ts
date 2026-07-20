import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Learning Universe",
    short_name: "Learning",
    description:
      "A multi-subject learning universe for early learners — explore English, Maths, Science, Shona, Mandarin and Social Sciences worlds with Aki the dragon.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#3f2f8e",
    theme_color: "#4c39a0",
    categories: ["education", "kids"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
