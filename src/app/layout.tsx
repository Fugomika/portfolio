import type { Metadata } from "next";
import { Pixelify_Sans, Nunito_Sans, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { UiProvider } from "@/components/ui-provider";
import { MusicProvider } from "@/components/music-provider";
import { MusicFx } from "@/components/music-fx";
import { NowPlayingPill } from "@/components/now-playing-pill";
import { site } from "@/data/site";
import "./globals.css";

const pixel = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const body = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Project write-ups are typeset like research papers.
const serif = Source_Serif_4({
  variable: "--font-paper",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: `${site.handle} — ${site.name}`,
  description: site.pitch,
  openGraph: {
    title: `${site.handle} — Software Engineer`,
    description: site.pitch,
    type: "website",
  },
};

const themeInit = `(function(){try{if(localStorage.getItem("fugo_theme")==="dark")document.documentElement.classList.add("dark");if(localStorage.getItem("fugo_scanlines")!=="off")document.documentElement.classList.add("scanlines")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pixel.variable} ${body.variable} ${mono.variable} ${serif.variable} h-full antialiased`}
    >
      <head>
        {/* Runs before paint so the saved theme never flashes */}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      {/* Extensions like Grammarly and ColorZilla inject attributes on body */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <UiProvider>
          <MusicProvider>
            {children}
            <MusicFx />
            <NowPlayingPill />
          </MusicProvider>
        </UiProvider>
      </body>
    </html>
  );
}
