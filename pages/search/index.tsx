import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";

import ListManga from "../../components/manga/ListManga";
import { Manga } from "../../interfaces/intefaces";
import { getCoverIds, getListManga } from "../../helpers/getMangaInfo";

export default function Search() {
  const [listManga, setListManga] = useState<Manga[]>([]);
  const router = useRouter();
  const { title } = router.query;
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(`/api/manga/search?title=${title}`, fetcher);

  useEffect(() => {
    if (!data || !data.results.length) return;
    console.log(data);
    const coverIds = getCoverIds(data.results);
    const queryIds = "?ids[]=" + coverIds.join("&ids[]=");
    axios
      .get(`/api/cover?coverIds=${coverIds}`)
      .then((res) => {
        const mangas = getListManga(data.results, res.data);
        setListManga(mangas);
      })
      .catch(() => {
        return "";
      });
  }, [data]);

  if (!data) {
    return <div className="text-white h-screen">Loading...</div>;
  }
  if (!data.results.length) {
    return (
      <div className="text-white h-screen text-center mt-10">
        No results match title {title}
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto">
      <p className="text-white text-3xl border-b border-opacity-40 border-white pb-3">
        Result
      </p>
      <div className="grid grid-cols-6 gap-6 mt-5">
        {listManga &&
          listManga.map((manga: Manga) => (
            <Link key={manga.id} href={`/manga/${manga.id}`}>
              <a>
                <ListManga manga={manga} />
              </a>
            </Link>
          ))}
      </div>
    </div>
  );
}
