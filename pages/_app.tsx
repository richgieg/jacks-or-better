import "@/styles/globals.css";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import * as amplitude from "@amplitude/analytics-browser";

const inter = Inter({ subsets: ["latin"] });

if (typeof window !== "undefined") {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
    defaultTracking: true,
  });
}

const TITLE = "9/6 Jacks or Better | Video Poker | No ads or downloads!";
const DESCRIPTION = "Free 9/6 Jacks or Better Video Poker for desktop and mobile! No ads. No downloads. Quick, easy, and fun!";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover" />
        <title>{TITLE}</title>
        <meta
          name="description"
          content={DESCRIPTION}
        />
        <meta property="og:title" content={TITLE} />
        <meta
          property="og:description"
          content={DESCRIPTION}
        />
        <meta
          property="og:image"
          content="https://www.jobvp.com/android-chrome-512x512.png"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <style jsx global>{`
          html {
            font-family: ${inter.style.fontFamily};
          }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
