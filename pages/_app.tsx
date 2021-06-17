import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import Head from "next/head";
// import "../dist/styles.css";
import "tailwindcss/tailwind.css";
import "../src/styles.css";

import LayoutPage from "../components/layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <LayoutPage>
        <Component {...pageProps} />
      </LayoutPage>
    </>
  );
}
export default MyApp;
