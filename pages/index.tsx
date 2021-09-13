import React, { useState, useCallback, useEffect, useRef } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useEmblaCarousel } from "embla-carousel/react";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

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
        <div ref={viewportRef} className="container pt-4 pb-10 overflow-hidden">
          <div
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
            className="flex items-center"
          >
            {props.mangaSuggest.map((manga) => (
              <div
                key={manga.id}
                className="flex justify-between min-w-full text-white cursor-move"
              >
                <Image
                  src={manga.urlImage}
                  alt="Suggestive manga"
                  width={300}
                  height={420}
                  className="rounded-xl"
                />
                <div className="w-2/3 h-full ml-2 md:h-5/6">
                  <p className="mt-4 mb-6 text-xl md:text-3xl md:mt-10 line-clamp-4 md:line-clamp-none">
                    {manga.title}
                  </p>
                  <p className="hidden mb-6 text-sm leading-normal md:block">
                    {manga.description}
                  </p>
                  <button
                    onClick={() => {
                      router.push(`/manga/${manga.id}`);
                    }}
                    className="px-2 py-2 mb-2 mr-4 text-sm font-semibold bg-red-600 rounded md:px-3 md:uppercase"
                  >
                    Read Now
                  </button>
                  <button className="px-2 py-2 text-sm font-semibold bg-green-500 rounded md:px-3 md:uppercase">
                    Add To Favorite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => scrollPrev()}
          className="absolute z-10 text-white top-2/4 left-4"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => scrollNext()}
          className="absolute z-10 text-white top-2/4 right-4"
        >
          <ChevronRightIcon className="w-6 h-6" />
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
  const resultSuggest: Result[] = dataSuggest.data;
  const dataSafe: IResponse = resSafe.data;
  const resultSafe: Result[] = dataSafe.data;

  const coverIdsSuggest = getCoverIds(resultSuggest);
  const queryIdsSuggest = "?ids[]=" + coverIdsSuggest.join("&ids[]=");
  const coverInfoSuggestRes = await axios.get(
    `${process.env.BASE_URL_DEX}/cover${queryIdsSuggest}&limit=4`
  );
  console.log(coverInfoSuggestRes.data);
  const coverInfosSuggest: { data: ICoverInfo[] } = coverInfoSuggestRes.data;

  const coverIdsSafe = getCoverIds(resultSafe);
  const queryIdsSafe = "?ids[]=" + coverIdsSafe.join("&ids[]=");
  const coverInfoSafeRes = await axios.get(
    `${process.env.BASE_URL_DEX}/cover${queryIdsSafe}&limit=60`
  );
  const coverInfosSafe: { data: ICoverInfo[] } = coverInfoSafeRes.data;

  //console.log(coverInfosSuggest);
  const mangaSuggest = getListManga(resultSuggest, coverInfosSuggest);
  const mangaSafe = getListManga(resultSafe, coverInfosSafe);

  return {
    props: {
      mangaSuggest: JSON.parse(JSON.stringify(mangaSuggest)),
      mangaSafe: JSON.parse(JSON.stringify(mangaSafe)),
    },
    revalidate: 5,
  };
};
