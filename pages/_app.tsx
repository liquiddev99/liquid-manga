import type { AppProps } from "next/app";
import Head from "next/head";
import "../src/styles.css";
import "tailwindcss/tailwind.css";
import { NextSeo } from "next-seo";

import LayoutPage from "../components/layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Manga Reading Site" />
        <meta property="og:title" content="Liquid Manga" />
        <meta property="og:description" content="manga reading site" />
        <meta property="og:url" content="https://www.liquidmanga.me/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo title="liquid manga" description="manga reading site" />
      <LayoutPage>
        <Component {...pageProps} />
      </LayoutPage>
    </>
  );
}
export default MyApp;
