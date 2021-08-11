import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import Head from "next/head";
import "tailwindcss/tailwind.css";
import "../src/styles.css";

import LayoutPage from "../components/layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="manga reading site" />
        <meta property="og:title" content="liquid manga" />
        <meta property="og:description" content="manga reading site" />
        <meta property="og:url" content="https://www.liquid-manga.site/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutPage>
        <Component {...pageProps} />
      </LayoutPage>
    </>
  );
}
export default MyApp;
