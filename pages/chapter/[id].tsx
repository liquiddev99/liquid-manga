import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";
import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";
import { getListChapter } from "../../helpers/getMangaInfo";
import { Chapter } from "../../interfaces/intefaces";

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
    relationships: [{ id: string; type: string }];
  };
}

interface imgData {
  result: string;
  baseUrl: string;
  chapter: {
    hash: string;
    data: [];
    dataSaver: [];
  };
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

  const imgFetcher = async (url: string) => {
    const res = await axios.get(url);
    setLoading(false);
    const data: imgData = res.data;
    return data;
  };
  const { data, error } = useSWR(`/api/chapter/${id}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { data: imgData, error: imgError } = useSWR(
    `/api/chapter/at-home?id=${id}`,
    imgFetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value);
  };

  const prevChapter = () => {
    if (!chapters) return;
    if (!chapters[currentIndex - 1]) return;
    const previousId = chapters[currentIndex - 1].id;
    router.push(`/chapter/${previousId}?language=${language}`);
  };
  const nextChapter = () => {
    if (!chapters) return;
    if (!chapters[currentIndex + 1]) return;
    const nextId = chapters[currentIndex + 1].id;
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
    console.log(imgData);
    const currIndex = chapters.findIndex((chapter) => chapter.id === id);
    if (chapters[currIndex + 1]) {
      router.prefetch(
        `/chapter/${chapters[currIndex + 1].id}?language=${language}`
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
    // setLoading(true);
    const mangaId = data.data.relationships.find(
      (relation: any) => relation.type === "manga"
    )!.id;
    setMangaId(mangaId);
    const getChapters = async () => {
      const listChapter = await getListChapter(mangaId, language);
      return listChapter;
    };
    getChapters().then((res) => {
      setChapters(res);
    });
  }, [data, language]);
  // if (error && error.response.status === 404) return <NotFound />;
  if (error) {
    return (
      <p className="container h-screen my-2 text-white">
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
        <div className="relative flex items-center justify-end w-full my-5 md:justify-center">
          <div
            className="absolute left-0 flex items-center px-2 font-bold text-white bg-green-500 rounded cursor-pointer lg:left-36 h-9"
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
            <ArrowLeftIcon className="w-5 h-5" />
          </div>
          <select
            className="w-2/5 p-2 text-black h-9"
            value={`/chapter/${id}?language=${language}`}
            onChange={handleChange}
          >
            {chapters.map((chapter: Chapter) => (
              <option
                value={`/chapter/${chapter.id}?language=${language}`}
                key={chapter.id}
              >
                Chapter {chapter.attributes.chapter}
              </option>
            ))}
          </select>
          <div
            className={`${
              disableNext ? "bg-gray-400" : "bg-red-500 cursor-pointer"
            } p-2`}
            onClick={nextChapter}
          >
            <ArrowRightIcon className="w-5 h-5" />
          </div>
        </div>
      )}
      {imgData &&
        !loading &&
        imgData.chapter.data.length > 0 &&
        imgData.chapter.data.map((fileName: string) => (
          <div className="w-full image-container" key={fileName}>
            {/* <div className="relative text-white aspect-w-3 aspect-h-4"> */}
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
              src={`${base_url}/data/${imgData.chapter.hash}/${fileName}`}
              alt="fetching image..."
              className="object-contain w-auto h-auto mx-auto"
            />
            {/* </div> */}
          </div>
        ))}

      {!loading && imgData && imgData.chapter.dataSaver.length == 0 && (
        <div className="text-white">Can't find image of this chapter</div>
      )}

      {imgData && imgData.chapter.dataSaver.length > 0 && !loading && chapters && (
        <div className="relative flex items-center justify-end w-full my-5 md:justify-center">
          <div
            className="absolute left-0 flex items-center px-2 font-bold text-white bg-green-500 rounded cursor-pointer lg:left-36 h-9"
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
            <ArrowLeftIcon className="w-5 h-5" />
          </div>
          <select
            className="w-2/5 p-2 text-black h-9"
            value={`/chapter/${id}?language=${language}`}
            onChange={handleChange}
          >
            {chapters.map((chapter: Chapter) => (
              <option
                value={`/chapter/${chapter.id}?language=${language}`}
                key={chapter.id}
              >
                Chapter {chapter.attributes.chapter}
              </option>
            ))}
          </select>
          <div
            className={`${
              disableNext ? "bg-gray-400" : "bg-red-500 cursor-pointer"
            } p-2`}
            onClick={nextChapter}
          >
            <ArrowRightIcon className="w-5 h-5" />
          </div>
        </div>
      )}
      {loading && <p className="h-screen my-2 text-white">Loading...</p>}
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
