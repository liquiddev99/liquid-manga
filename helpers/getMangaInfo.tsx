import axios from "axios";
//import useSWR from "swr";

import { ICoverInfo, Result, Chapter } from "../interfaces/intefaces";

export const getCoverIds = (listManga: Result[]) => {
  const coverIds = listManga.map((manga: Result) => {
    const coverRelation: { id: string; type: string } =
      manga.relationships.find((relation: { id: string; type: string }) => {
        return relation.type === "cover_art";
      })!;
    return coverRelation.id;
  });
  return coverIds;
};

export const getListManga = (
  results: Result[],
  coverInfos: { results: ICoverInfo[] }
) => {
  const listManga = results.map((result: Result) => {
    const coverArt: ICoverInfo = coverInfos.results.find(
      (coverInfo: ICoverInfo) => {
        const mangaRelation = coverInfo.relationships.find(
          (relation) => relation.type === "manga"
        )!;
        return mangaRelation.id === result.data.id;
      }
    )!;
    return {
      id: result.data.id,
      title: result.data.attributes.title.en,
      description: result.data.attributes.description.en,
      urlImage: `https://uploads.mangadex.org/covers/${result.data.id}/${coverArt.data.attributes.fileName}`,
      status: result.data.attributes.status,
    };
  });
  return listManga;
};

export const getListChapter = async (mangaId: string, language = "en") => {
  const res = await axios.get(
    `/api/chapter/manga?mangaId=${mangaId}&offset=0&language=${language}`
  );

  //const fetcher = (url: string) => fetch(url).then((r) => r.json());

  //const { data: fetchedListChapter, error: fetchListChapterError } = useSWR(
  //`/api/chapter/manga?mangaId=${mangaId}&offset=0&language=${language}`,
  //fetcher
  //);

  //if (!fetchedListChapter) return;
  //if (fetchListChapterError) throw Error("Error when fetch list chapter");

  const data = res.data;
  const { total } = data;
  const count = Math.floor(total / 100);
  let listChapter: Chapter[] = [];
  const promises = [];
  listChapter = listChapter.concat(data.results);

  for (let i = 1; i <= count; i++) {
    promises.push(
      axios
        .get(
          `/api/chapter/manga?mangaId=${mangaId}&offset=${
            i * 100
          }&language=${language}`
        )
        .then((res) => {
          listChapter = listChapter.concat(res.data.results);
        })
    );
  }

  await Promise.all(promises);
  listChapter.sort(
    (a: Chapter, b: Chapter) =>
      Number(a.data.attributes.chapter) - Number(b.data.attributes.chapter)
  );
  listChapter = listChapter.filter((chapter, index, array) => {
    if (!array[index + 1]) return true;
    return (
      chapter.data.attributes.chapter !==
      array[index + 1].data.attributes.chapter
    );
  });
  return listChapter;
};
