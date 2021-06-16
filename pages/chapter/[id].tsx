import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import useSWR from "swr";
import axios from "axios";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";

import { getListChapter } from "../../helpers/getMangaInfo";
import NotFound from "../../components/error/NotFound";
import { Chapter } from "../../interfaces/intefaces";

export default function ChapterDetail(props: {
  base_url: string;
  temp_token: string;
}) {
  const router = useRouter();
  const { id } = router.query;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [mangaId, setMangaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { base_url, temp_token } = props;
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(`/api/chapter/${id}`, fetcher);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value);
  };

  const prevChapter = () => {
    if (!chapters) return;
    if (!chapters[currentIndex - 1]) return;
    const previousId = chapters[currentIndex - 1].data.id;
    router.push(`/chapter/${previousId}`);
  };
  const nextChapter = () => {
    if (!chapters) return;
    if (!chapters[currentIndex + 1]) return;
    const nextId = chapters[currentIndex + 1].data.id;
    router.push(`/chapter/${nextId}`);
  };

  const backToManga = () => {
    if (!mangaId) return;
    router.push(`/manga/${mangaId}`);
  };

  // const handleKeyDown = (e: any) => {
  //   if (e.key === "ArrowRight") {
  //     nextChapter();
  //   }
  //   if (e.key === "ArrowLeft") {
  //     prevChapter();
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log("router change");
  // }, [router.query.id]);

  useEffect(() => {
    if (!chapters) return;
    setDisablePrev(false);
    setDisableNext(false);
    const currIndex = chapters.findIndex((chapter) => chapter.data.id === id);
    setCurrentIndex(currIndex);
    if (!chapters[currIndex - 1]) {
      setDisablePrev(true);
    }
    if (!chapters[currIndex + 1]) {
      setDisableNext(true);
    }
  }, [id, chapters]);

  useEffect(() => {
    if (!data) return;
    setLoading(false);
    const mangaId = data.relationships.find(
      (relation: any) => relation.type === "manga"
    ).id;
    setMangaId(mangaId);
    const getChapters = async () => {
      const listChapter = await getListChapter(mangaId, "en");
      return listChapter;
    };
    getChapters().then((res) => {
      console.log(res);
      setChapters(res);
    });
  }, [data]);
  // if (error && error.response.status === 404) return <NotFound />;
  if (error) {
    return (
      <p className="text-white h-screen my-2 container">
        Can't find this chapter
      </p>
    );
  }
  return (
    <div className="container flex flex-col items-center min-h-screen">
      {!loading && chapters && (
        <div className="w-full flex justify-center items-center my-5 relative">
          <div
            className="absolute left-36 bg-green-500 h-9 flex items-center px-2 rounded cursor-pointer text-white font-bold"
            onClick={backToManga}
          >
            Manga Info
          </div>
          <div
            className={`${
              disablePrev ? "bg-gray-400" : "bg-red-500 cursor-pointer"
            } p-2`}
            onClick={prevChapter}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </div>
          <select
            className="text-black w-2/5 h-9 p-2"
            value={`/chapter/${id}`}
            onChange={handleChange}
          >
            {chapters.map((chapter: Chapter) => (
              <option
                value={`/chapter/${chapter.data.id}`}
                key={chapter.data.id}
              >
                Chapter {chapter.data.attributes.chapter}
              </option>
            ))}
          </select>
          <div
            className={`${
              disableNext ? "bg-gray-400" : "bg-red-500 cursor-pointer"
            } p-2`}
          >
            <ArrowRightIcon className="h-5 w-5" onClick={nextChapter} />
          </div>
        </div>
      )}
      {data &&
        data.data.attributes.data.map((fileName: string) => (
          <div className="my-2 w-full h-auto" key={fileName}>
            <div className="aspect-w-3 aspect-h-4 text-white">
              <Image
                src={`${base_url}/${temp_token}/data/${data.data.attributes.hash}/${fileName}`}
                alt="fetching image..."
                layout="fill"
                priority={true}
                objectFit="contain"
              />
            </div>
          </div>
        ))}

      {!loading && chapters && (
        <div className="w-full flex justify-center items-center my-5 relative">
          <div
            className="absolute left-36 bg-green-500 h-9 flex items-center px-2 rounded cursor-pointer text-white font-bold"
            onClick={backToManga}
          >
            Manga Info
          </div>
          <div
            className={`${
              disablePrev ? "bg-gray-400" : "bg-red-500 cursor-pointer"
            } p-2`}
            onClick={prevChapter}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </div>
          <select
            className="text-black w-2/5 h-9 p-2"
            value={`/chapter/${id}`}
            onChange={handleChange}
          >
            {chapters.map((chapter: Chapter) => (
              <option
                value={`/chapter/${chapter.data.id}`}
                key={chapter.data.id}
              >
                Chapter {chapter.data.attributes.chapter}
              </option>
            ))}
          </select>
          <div
            className={`${
              disableNext ? "bg-gray-400" : "bg-red-500 cursor-pointer"
            } p-2`}
          >
            <ArrowRightIcon className="h-5 w-5" onClick={nextChapter} />
          </div>
        </div>
      )}
      {loading && <p className="text-white h-screen my-2">Loading...</p>}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      base_url: process.env.BASE_URL,
      temp_token: process.env.TEMP_TOKEN,
    },
  };
};
