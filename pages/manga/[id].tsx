import { useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import axios from "axios";
import Image from "next/image";
import useSWR from "swr";

import { Manga, Result, Tag } from "../../interfaces/intefaces";

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface MangaDetail extends Manga {
  tags: [{ id: string; name: string }];
}

export default function DetailManga(props: { manga: MangaDetail }) {
  const { manga } = props;
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(
    `https://api.mangadex.org/chapter?manga=${manga.id}&limit=100&translatedLanguage[]=en`,
    fetcher
  );
  if (data) {
    data.results.sort(
      (a: any, b: any) => a.data.attributes.chapter - b.data.attributes.chapter
    );
    data.results.map((result: any) =>
      console.log(result.data.attributes.chapter)
    );
  }
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
          {data &&
            data.results.map((result: any) => (
              <Link key={result.data.id} href={`/chapter/${result.data.id}`}>
                <a>
                  <div className="py-1">
                    Chapter {result.data.attributes.chapter}
                    {result.data.attributes.title &&
                      ` - ${result.data.attributes.title}`}
                  </div>
                </a>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as IParams;
  const res = await axios.get(`${process.env.BASE_URL_DEX}/manga/${id}`);
  const mangaInfo: Result = res.data;

  if (!mangaInfo) {
    return {
      notFound: true,
    };
  }

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
};
