import axios from "axios";

import { ICoverInfo, Result, Chapter, Manga } from "../interfaces/intefaces";

interface MangaDetail extends Manga {
  tags: [{ id: string; name: string }];
}

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

export const getListChapter = async (mangaId: string) => {
  const res = await axios.get(`/api/manga/${mangaId}?offset=0`);

  const data = res.data;
  const { total } = data;
  const count = Math.floor(total / 100);
  let listChapter: Chapter[] = [];
  const promises = [];
  listChapter = listChapter.concat(data.results);

  for (let i = 1; i <= count; i++) {
    promises.push(
      axios.get(`/api/manga/${mangaId}?offset=${i * 100}`).then((res) => {
        listChapter = listChapter.concat(res.data.results);
      })
    );
  }

  await Promise.all(promises);
  listChapter.sort(
    (a: Chapter, b: Chapter) =>
      Number(a.data.attributes.chapter) - Number(b.data.attributes.chapter)
  );
  return listChapter;
};
