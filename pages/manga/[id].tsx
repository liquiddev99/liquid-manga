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
    <div className="text-white container">
      <Head>
        <title>{manga ? manga.title : "Manga"}</title>
      </Head>
      <div className="w-full text-white py-10 flex flex-col md:flex-row justify-between">
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
            <div className="md:w-2/3 md:ml-3 mt-3">
              <p className="text-2xl md:text-3xl mt-5 mb-2">{manga.title}</p>
              <p className="capitalize text-gray-300">{manga.status}</p>
              {manga.altTitles && (
                <p className="capitalize text-gray-300 mb-2">
                  Alt Titles: {manga.altTitles}
                </p>
              )}
              {manga.tags.map((tag) => (
                <div
                  key={tag.id}
                  className="px-2 py-1 mb-2 mr-2 border rounded border-white inline-block"
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
        <p className="text-white text-3xl border-b border-opacity-40 border-white pb-3">
          List Chapter
        </p>
        <select
          className="text-black mb-2 ml-10 mt-5 p-1"
          name="language"
          onChange={handleChange}
          value={language}
        >
          <option value="en">English</option>
          <option value="vi">Vietnam</option>
        </select>
        <div className="rounded overflow-y-auto w-2/3 h-96 mt-5 mx-auto">
          {chapters &&
            chapters.map((chapter: Chapter) => {
              const date = new Date(chapter.data.attributes.publishAt);
              return (
                <Link
                  key={chapter.data.id}
                  href={`/chapter/${chapter.data.id}?language=${language}`}
                >
                  <a>
                    <div className="py-1 px-4 flex justify-between">
                      <p>
                        Chapter {chapter.data.attributes.chapter}
                        {chapter.data.attributes.title &&
                          ` - ${chapter.data.attributes.title}`}
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
