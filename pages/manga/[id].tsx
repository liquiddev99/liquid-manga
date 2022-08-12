import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import useSWR from "swr";

import { Chapter, Manga } from "../../interfaces/intefaces";
import { getListChapter } from "../../helpers/getMangaInfo";
import DetailMangaSke from "../../components/skeleton/DetailMangaSke";

interface MangaDetail extends Manga {
  tags: [{ id: string; name: string }];
  altTitles: string;
}

export default function DetailManga() {
  const router = useRouter();
  const id = router.query.id as string;
  const [manga, setManga] = useState<MangaDetail>();
  const [notFoundManga, setNotFoundManga] = useState(false);
  const [loadingManga, setLoadingManga] = useState(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [language, setLanguage] = useState("en");

  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  const { data: fetchedManga, error: mangaError } = useSWR(
    id ? `/api/manga/${id}` : null,
    fetcher
  );

  useEffect(() => {
    setNotFoundManga(false);
    setLoadingManga(true);
    if (!fetchedManga) return;
    if (mangaError) {
      setNotFoundManga(true);
      setLoadingManga(false);
      return;
    }
    setManga(fetchedManga);
    setLoadingManga(false);
  }, [fetchedManga, mangaError]);

  //useEffect(() => {
  //if (!id) return;
  //setNotFoundManga(false);
  //setLoadingManga(true);
  //axios
  //.get(`/api/manga/${id}`)
  //.then((res) => {
  //setManga(res.data);
  //})
  //.catch(() => {
  //setNotFoundManga(true);
  //})
  //.finally(() => {
  //setLoadingManga(false);
  //});
  //}, [id]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    setChapters([]);
    setNotFound(false);
    const getChapters = async () => {
      if (!id) return [];
      const listChapter = await getListChapter(id, language);
      return listChapter;
    };
    getChapters()
      .then((data) => {
        if (!data.length) {
          setNotFound(true);
        }
        setChapters(data);
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [language, id]);

  // if (error && error.response.status === 404) return <NotFound />;

  return (
    <div className="text-white max-w-screen-xl container w-10/12 md:w-11/12">
      <Head>
        <title>{manga ? manga.title : "Manga"}</title>
      </Head>
      <div className="flex flex-col justify-between w-full py-10 text-white md:flex-row">
        {!loadingManga && manga && (
          <>
            <Image
              src={manga.urlImage}
              width={300}
              height={400}
              objectFit="contain"
              alt="Cover Image"
              quality={50}
            />
            <div className="mt-3 md:w-2/3 md:ml-3">
              <p className="mt-5 mb-2 text-2xl md:text-3xl">{manga.title}</p>
              <p className="text-gray-300 capitalize">{manga.status}</p>
              {manga.altTitles && (
                <p className="mb-2 text-gray-300 capitalize">
                  Alt Titles: {manga.altTitles}
                </p>
              )}
              {manga.tags.map((tag) => (
                <div
                  key={tag.id}
                  className="inline-block px-2 py-1 mb-2 mr-2 border border-white rounded"
                >
                  {tag.name}
                </div>
              ))}
              <p className="line-clamp-10">{manga.description}</p>
            </div>
          </>
        )}
        {notFoundManga && <p>Manga Not Found</p>}
        {loadingManga && <DetailMangaSke />}
      </div>
      <div>
        <p className="pb-3 text-3xl text-white border-b border-white border-opacity-40">
          List Chapter
        </p>
        <select
          className="p-1 mt-5 mb-2 ml-10 text-black"
          name="language"
          onChange={handleChange}
          value={language}
        >
          <option value="en">English</option>
          <option value="vi">Vietnam</option>
        </select>
        <div className="w-2/3 mx-auto mt-5 overflow-y-auto rounded h-96">
          {chapters &&
            chapters.map((chapter: Chapter) => {
              const date = new Date(chapter.attributes.publishAt);
              return (
                <Link
                  key={chapter.id}
                  href={`/chapter/${chapter.id}?language=${language}`}
                >
                  <a>
                    <div className="flex justify-between px-4 py-1">
                      <p>
                        Chapter {chapter.attributes.chapter}
                        {chapter.attributes.title &&
                          ` - ${chapter.attributes.title}`}
                      </p>
                      <p>
                        {date &&
                          date.getDate() +
                            "/" +
                            (date.getMonth() + 1) +
                            "/" +
                            date.getFullYear()}
                      </p>
                    </div>
                  </a>
                </Link>
              );
            })}
          {loading && <p>Loading...</p>}
          {notFound && (
            <p>
              No chapters found in{" "}
              {language === "vi" ? "Vietnamese" : "English"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
