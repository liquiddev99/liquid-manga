import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";
import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";
import { getListChapter } from "../../helpers/getMangaInfo";
import { Chapter } from "../../interfaces/intefaces";
import Image from "next/image";

interface Data {
  result: string;
  data: {
    attributes: {
      data: [];
      publishAt: string;
      hash: string;
      title: string;
      chapter: string;
    };
  };
  relationships: [{ id: string; type: string }];
}

export default function ChapterDetail(props: {
  base_url: string;
  temp_token: string;
}) {
  const router = useRouter();
  let { id } = router.query;
  let language = router.query.language as string;
  language = language || "en";
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [mangaId, setMangaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { base_url, temp_token } = props;

  const fetcher = async (url: string) => {
    setLoading(true);
    const res = await axios.get(url);
    setLoading(false);
    const data: Data = res.data;
    return data;
  };
  const { data, error } = useSWR(`/api/chapter/${id}`, fetcher);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value);
  };

  const prevChapter = () => {
    if (!chapters) return;
    if (!chapters[currentIndex - 1]) return;
    const previousId = chapters[currentIndex - 1].data.id;
    router.push(`/chapter/${previousId}?language=${language}`);
  };
  const nextChapter = () => {
    if (!chapters) return;
    if (!chapters[currentIndex + 1]) return;
    const nextId = chapters[currentIndex + 1].data.id;
    router.push(`/chapter/${nextId}?language=${language}`);
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
    if (chapters[currIndex + 1]) {
      router.prefetch(
        `/chapter/${chapters[currIndex + 1].data.id}?language=${language}`
      );
    }
    setCurrentIndex(currIndex);
    if (!chapters[currIndex - 1]) {
      setDisablePrev(true);
    }
    if (!chapters[currIndex + 1]) {
      setDisableNext(true);
    }
  }, [id, chapters, language, router]);

  useEffect(() => {
    if (!data) return;
    console.log(data, "data");
    // setLoading(true);
    const mangaId = data.relationships.find(
      (relation: any) => relation.type === "manga"
    )!.id;
    setMangaId(mangaId);
    const getChapters = async () => {
      const listChapter = await getListChapter(mangaId, language);
      return listChapter;
    };
    getChapters().then((res) => {
      console.log(res);
      setChapters(res);
    });
  }, [data, language]);
  // if (error && error.response.status === 404) return <NotFound />;
  if (error) {
    return (
      <p className="text-white h-screen my-2 container">
        Can&#39;t find this chapter
      </p>
    );
  }
  return (
    <div className="container flex flex-col items-center min-h-screen">
      <Head>
        <title>
          {data?.data.attributes.title
            ? data.data.attributes.title
            : `Chapter ${data?.data.attributes.chapter}`}
        </title>
      </Head>
      {!loading && chapters && (
        <div className="w-full flex justify-end md:justify-center items-center my-5 relative">
          <div
            className="absolute left-0 lg:left-36 bg-green-500 h-9 flex items-center px-2 rounded cursor-pointer text-white font-bold"
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
            value={`/chapter/${id}?language=${language}`}
            onChange={handleChange}
          >
            {chapters.map((chapter: Chapter) => (
              <option
                value={`/chapter/${chapter.data.id}?language=${language}`}
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
            onClick={nextChapter}
          >
            <ArrowRightIcon className="h-5 w-5" />
          </div>
        </div>
      )}
      {data &&
        data.data.attributes.data.map((fileName: string) => (
          <div className="w-full image-container" key={fileName}>
            {/* <div className="aspect-w-3 aspect-h-4 text-white relative"> */}
            {/* <Image
              src={`${base_url}/${temp_token}/data/${data.data.attributes.hash}/${fileName}`}
              alt="fetching image..."
              layout="fill"
              // sizes="75vw"
              className="image"
              priority={true}
              objectFit="contain"
            /> */}
            <img
              src={`${base_url}/${temp_token}/data/${data.data.attributes.hash}/${fileName}`}
              alt="fetching image..."
              className="w-auto h-auto mx-auto object-contain"
            />
            {/* </div> */}
          </div>
        ))}

      {!loading && chapters && (
        <div className="w-full flex justify-end md:justify-center items-center my-5 relative">
          <div
            className="absolute left-0 lg:left-36 bg-green-500 h-9 flex items-center px-2 rounded cursor-pointer text-white font-bold"
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
            value={`/chapter/${id}?language=${language}`}
            onChange={handleChange}
          >
            {chapters.map((chapter: Chapter) => (
              <option
                value={`/chapter/${chapter.data.id}?language=${language}`}
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
            onClick={nextChapter}
          >
            <ArrowRightIcon className="h-5 w-5" />
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
