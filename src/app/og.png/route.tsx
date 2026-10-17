import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/site";

// The link-preview card (WhatsApp, Telegram, LinkedIn, X…), rendered once at
// build time from the same site data as the page.
//
// It's a route named `og.png` rather than the `opengraph-image` convention
// because static export writes that one as an extension-less file, which
// GitHub Pages serves as application/octet-stream — and some apps (WhatsApp
// included) won't show an image without an image/* type. layout.tsx points
// og:image here.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = `${site.shortName} (${site.handle}) — ${site.role}`;
// Required with `output: "export"`: render the PNG once at build time.
export const dynamic = "force-static";

const C = {
  paper: "#f7f2e5",
  card: "#fffbef",
  ink: "#26221a",
  inkSoft: "#6f6754",
  lime: "#b8e62e",
  limeDeep: "#4c7a06",
  disc: "#1c1b22",
  groove: "#34313f",
};

const asset = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));

/** A ring of the record: a centred circle with a border. */
function Ring({ d, color, width = 2 }: { d: number; color: string; width?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        width: d,
        height: d,
        borderRadius: 9999,
        border: `${width}px solid ${color}`,
      }}
    />
  );
}

export async function GET() {
  const [pixel, mono, body, avatar] = await Promise.all([
    asset("PixelifySans-Bold.woff"),
    asset("IBMPlexMono-Regular.woff"),
    asset("NunitoSans-Regular.woff"),
    asset("avatar.png"),
  ]);
  const avatarSrc = `data:image/png;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          background: C.paper,
          // Thick pixel frame, like the site's bordered cards
          border: `12px solid ${C.ink}`,
        }}
      >
        {/* Left: who */}
        <div style={{ display: "flex", flexDirection: "column", width: 680 }}>
          <div style={{ display: "flex", fontFamily: "Plex Mono", fontSize: 22, color: C.limeDeep }}>
            {`// ${site.role.toLowerCase()} @ ${site.company}`}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 22 }}>
            <div style={{ width: 34, height: 34, background: C.lime, marginRight: 22, marginTop: 22 }} />
            <div
              style={{
                display: "flex",
                fontFamily: "Pixelify",
                fontSize: 78,
                lineHeight: 1.05,
                color: C.ink,
                width: 560,
              }}
            >
              {site.shortName}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Plex Mono", fontSize: 24, color: C.inkSoft, marginTop: 18 }}>
            {`aka ${site.handle} · ${site.location}`}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Nunito Sans",
              fontSize: 28,
              lineHeight: 1.4,
              color: C.ink,
              marginTop: 24,
              width: 580,
            }}
          >
            {site.pitch}
          </div>
          <div style={{ display: "flex", marginTop: 34 }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Pixelify",
                fontSize: 30,
                color: C.ink,
                background: C.lime,
                border: `4px solid ${C.ink}`,
                boxShadow: `6px 6px 0 0 ${C.ink}`,
                padding: "10px 26px",
              }}
            >
              {site.url.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </div>

        {/* Right: the record from the hero, with the avatar as its label */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 400,
            height: 400,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: 9999,
              background: C.disc,
              border: `4px solid ${C.ink}`,
            }}
          />
          <Ring d={360} color={C.groove} />
          <Ring d={320} color={C.groove} />
          <Ring d={280} color={C.groove} />
          <Ring d={240} color="#0b0b0b" width={6} />
          <img
            src={avatarSrc}
            width={200}
            height={200}
            style={{ position: "absolute", borderRadius: 9999, border: "6px solid #0b0b0b" }}
          />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Pixelify", data: pixel, weight: 700, style: "normal" },
        { name: "Plex Mono", data: mono, weight: 400, style: "normal" },
        { name: "Nunito Sans", data: body, weight: 400, style: "normal" },
      ],
    },
  );
}
