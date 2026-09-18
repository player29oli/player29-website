import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = siteConfig.tagline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoBytes = await readFile(
    join(process.cwd(), "public/brand/player29-wordmark-dark.png"),
  );
  const logoSrc = `data:image/png;base64,${logoBytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111318",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 96,
            height: 6,
            borderRadius: 999,
            backgroundImage: "linear-gradient(90deg, #20B8F6 0%, #8C24F5 100%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" height={92} />
        <p
          style={{
            margin: 0,
            color: "#F3F5F7",
            fontSize: 36,
            lineHeight: 1.3,
            maxWidth: 820,
          }}
        >
          {siteConfig.tagline}
        </p>
      </div>
    ),
    { ...size },
  );
}
