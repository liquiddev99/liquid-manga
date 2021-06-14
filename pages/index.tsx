import React, { useState, useCallback, useEffect, useRef } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useEmblaCarousel } from "embla-carousel/react";
import axios from "axios";

import LastUpdated from "../components/home/LastUpdated";
import {
  IResponse,
  IPropsListManga,
  ICoverInfo,
  Result,
} from "../interfaces/intefaces";
import { getCoverIds, getListManga } from "../helpers/getMangaInfo";

export default function Home(props: IPropsListManga) {
  const router = useRouter();
  // Setup Embla
  const [viewportRef, embla] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const scrollPrev = useCallback(() => {
    if (embla?.canScrollPrev()) {
      embla.scrollPrev();
    } else {
      embla?.scrollTo(-1);
    }
  }, [embla]);
  const scrollNext = useCallback(() => {
    if (embla?.canScrollNext()) {
      embla.scrollNext();
    } else {
      embla?.scrollTo(0);
    }
  }, [embla]);
  const scrollTo = useCallback(
    (index) => embla && embla.scrollTo(index),
    [embla]
  );
  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla, setSelectedIndex]);
  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, setScrollSnaps, onSelect]);

  // SetInterval for AutoPlay
  const savedCallback: any = useRef();
  const autoPlay = () => {
    if (embla?.canScrollNext()) {
      scrollNext();
    } else {
      embla?.scrollTo(0);
    }
  };
  useEffect(() => {
    savedCallback.current = autoPlay;
  });
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (!pause) {
      let id = setInterval(tick, 3000);
      return () => clearInterval(id);
    }
  }, [pause]);

  return (
    <>
      <Head>
        <title>Liquid Manga</title>
      </Head>
      <div className="relative bg-gradient-to-b from-top via-middle to-bottom">
        <div ref={viewportRef} className="overflow-hidden pt-4 pb-10 container">
          <div
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
            className="flex items-center"
          >
            {props.mangaSuggest.map((manga) => (
              <div
                key={manga.id}
                className="cursor-move text-white min-w-full flex justify-between"
              >
                <Image
                  src={manga.urlImage}
                  alt="Suggestive Manga"
                  width={300}
                  height={420}
                  className="rounded-xl"
                />
                <div className="h-5/6 w-2/3">
                  <p className="text-3xl mt-10 mb-6">{manga.title}</p>
                  <p className="text-sm leading-normal mb-6">
                    {manga.description}
                  </p>
                  <button
                    onClick={() => {
                      router.push(`/manga/${manga.id}`);
                    }}
                    className="mr-4 bg-red-600 py-2 px-3 rounded uppercase font-semibold text-sm"
                  >
                    Read now
                  </button>
                  <button className="py-2 px-3 rounded uppercase font-semibold text-sm bg-green-500">
                    Add to favorite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => scrollPrev()}
          className="absolute top-2/4 text-white z-10 left-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => scrollNext()}
          className="absolute top-2/4 text-white z-10 right-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <LastUpdated mangaSafe={props.mangaSafe} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const resSuggest = await axios.get(
    `${process.env.BASE_URL_DEX}/manga?contentRating[]=suggestive&limit=4`
  );
  const resSafe = await axios.get(
    `${process.env.BASE_URL_DEX}/manga?contentRating[]=safe&limit=60`
  );
  const dataSuggest: IResponse = resSuggest.data;
  const resultSuggest: Result[] = dataSuggest.results;
  const dataSafe: IResponse = resSafe.data;
  const resultSafe: Result[] = dataSafe.results;

  const coverIdsSuggest = getCoverIds(resultSuggest);
  const queryIdsSuggest = "?ids[]=" + coverIdsSuggest.join("&ids[]=");
  const coverInfoSuggestRes = await axios.get(
    `${process.env.BASE_URL_DEX}/cover${queryIdsSuggest}`
  );
  const coverInfosSuggest: { results: ICoverInfo[] } = coverInfoSuggestRes.data;

  const coverIdsSafe = getCoverIds(resultSafe);
  const queryIdsSafe = "?ids[]=" + coverIdsSafe.join("&ids[]=");
  const coverInfoSafeRes = await axios.get(
    `${process.env.BASE_URL_DEX}/cover${queryIdsSafe}&limit=60`
  );
  const coverInfosSafe: { results: ICoverInfo[] } = coverInfoSafeRes.data;

  const mangaSuggest = getListManga(resultSuggest, coverInfosSuggest);
  const mangaSafe = getListManga(resultSafe, coverInfosSafe);

  return { props: { mangaSuggest, mangaSafe }, revalidate: 5 };
};
