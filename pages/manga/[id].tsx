import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import axios from "axios";
import Image from "next/image";
import useSWR from "swr";

import { Chapter, Manga, Result, Tag } from "../../interfaces/intefaces";
import NotFound from "../../components/error/NotFound";
import { getListChapter } from "../../helpers/getMangaInfo";

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface MangaDetail extends Manga {
  tags: [{ id: string; name: string }];
}

export default function DetailManga(props: { manga: MangaDetail }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { manga } = props;
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  useEffect(() => {
    const getChapters = async () => {
      const listChapter = await getListChapter(manga.id);
      console.log(listChapter, "listChapter");
      return listChapter;
    };
    getChapters().then((data) => {
      setChapters(data);
    });
  }, []);

  // if (error && error.response.status === 404) return <NotFound />;

  return (
    <div className="w-11/12 mx-auto text-white">
      <div className="w-full text-white flex justify-between py-10">
        <Image src={manga.urlImage} width={300} height={400} />
        <div className="h-5/6 w-2/3">
          <p className="text-3xl mt-5 mb-2">{manga.title}</p>
          <p className="capitalize text-gray-300 mb-2">{manga.status}</p>
          {manga.tags.map((tag) => (
            <div
              key={tag.id}
              className="px-2 py-1 mb-2 mr-2 border rounded border-white inline-block"
            >
              {tag.name}
            </div>
          ))}
          <p>{manga.description}</p>
        </div>
      </div>
      <div>
        <p className="text-white text-3xl border-b border-opacity-40 border-white pb-3">
          List Chapter
        </p>
        <div className="rounded overflow-y-auto w-2/3 h-96 mt-5 mx-auto">
          {chapters &&
            chapters.map((chapter: Chapter) => {
              const date = new Date(chapter.data.attributes.publishAt);
              return (
                <Link
                  key={chapter.data.id}
                  href={`/chapter/${chapter.data.id}`}
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
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.params as IParams;
    const res = await axios.get(`${process.env.BASE_URL_DEX}/manga/${id}`);
    const mangaInfo: Result = res.data;

    const coverId = mangaInfo.relationships.find(
      (relation) => relation.type === "cover_art"
    )?.id;
    const coverInfo = await axios.get(
      `${process.env.BASE_URL_DEX}/cover/${coverId}`
    );
    const fileName = coverInfo.data.data.attributes.fileName;

    const tags = mangaInfo.data.attributes.tags.map((tag: Tag) => {
      return { id: tag.id, name: tag.attributes.name.en };
    });

    return {
      props: {
        manga: {
          id: mangaInfo.data.id,
          title: mangaInfo.data.attributes.title.en,
          description: mangaInfo.data.attributes.description.en,
          tags,
          urlImage: `${process.env.BASE_URL_IMG}/${mangaInfo.data.id}/${fileName}`,
          status: mangaInfo.data.attributes.status,
        },
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
