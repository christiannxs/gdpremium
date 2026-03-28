import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://gdpremium.com.br"),
  title: "GD Premium — Joias em Ouro 18k | Catálogo Exclusivo",
  description: "A GD Premium oferece joias em ouro 18k com garantia vitalícia. Alianças, anéis e peças exclusivas com atendimento personalizado e envio para todo o Brasil.",
  keywords: ["joias", "ouro 18k", "alianças", "anéis", "gd premium", "joalheria", "cariri"],
  openGraph: {
    type: "website",
    url: "https://gdpremium.com.br/",
    title: "GD Premium — Joias em Ouro 18k",
    description: "Catálogo exclusivo de joias em ouro 18k com garantia vitalícia e envio para todo o Brasil.",
    images: [{ url: "/assets/fotohero-desktop.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GD Premium — Joias em Ouro 18k",
    description: "Joias exclusivas em ouro 18k com garantia vitalícia. Confira nosso catálogo.",
    images: ["/assets/fotohero-desktop.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "GD Premium",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <ConvexClientProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
