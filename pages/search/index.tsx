import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";

import ListManga from "../../components/manga/ListManga";
import { Manga } from "../../interfaces/intefaces";
import { getCoverIds, getListManga } from "../../helpers/getMangaInfo";
import ListMangaSke from "../../components/skeleton/ListMangaSke";
import Pagination from "../../components/pagination/Pagination";

export default function Search() {
  const [listManga, setListManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const router = useRouter();
  const { title } = router.query;
  let p = parseInt(router.query.p as string);
  p = p || 1;

  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  const { data: mangasInfo, error: mangasError } = useSWR(
    title && p ? `/api/manga/search?title=${title}&p=${p}` : null,
    fetcher
  );
  const { data: coversImg, error: coversError } = useSWR(
    () => "/api/cover?coverIds=" + getCoverIds(mangasInfo.data),
    fetcher
  );

  useEffect(() => {
    setLoading(true);
    setListManga([]);
    if (!router.isReady || !mangasInfo) return;
    if (mangasError || !mangasInfo.data.length) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setTotalPage(Math.ceil(mangasInfo.total / 100));
  }, [title, p, router.isReady, mangasInfo, mangasError]);

  useEffect(() => {
    if (coversError) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    if (!coversImg || !mangasInfo.data) return;
    const mangas = getListManga(mangasInfo.data, coversImg);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setListManga(mangas);
    setLoading(false);
  }, [coversImg, mangasInfo, coversError]);

  //useEffect(() => {
  //setLoading(true);
  //setListManga([]);
  //if (!router.isReady) return;
  //axios.get(`/api/manga/search?title=${title}&p=${p}`).then((res) => {
  //setNotFound(false);
  //const data = res.data;
  //if (!data.results.length) {
  //setLoading(false);
  //setNotFound(true);
  //return;
  //}
  //console.log(data);
  //setTotalPage(Math.ceil(data.total / 100));
  //const coverIds = getCoverIds(data.results);
  //axios
  //.get(`/api/cover?coverIds=${coverIds}`)
  //.then((res) => {
  //const mangas = getListManga(data.results, res.data);
  //setListManga(mangas);
  //window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  //})
  //.catch(() => {
  //return "";
  //})
  //.finally(() => {
  //setLoading(false);
  //});
  //});
  //}, [title, p, router.isReady]);

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <div className="container max-w-screen-xl">
        <p className="text-white text-3xl border-b border-opacity-40 border-white pb-3 mt-3">
          Result
        </p>
        <div className="responsive-list-manga mt-5">
          {listManga.length
            ? listManga.map((manga: Manga) => (
                <Link key={manga.id} href={`/manga/${manga.id}`}>
                  <a>
                    <ListManga manga={manga} />
                  </a>
                </Link>
              ))
            : null}
          {loading && (
            <>
              {Array.from(Array(12).keys()).map((_, index) => (
                <ListMangaSke key={index} />
              ))}
            </>
          )}
          {notFound && (
            <p className="text-white col-span-full h-screen">
              No results match title {title}
            </p>
          )}
        </div>

        <Pagination p={p} totalPage={totalPage} />
      </div>
    </>
  );
}
