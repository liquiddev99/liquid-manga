import axios from "axios";

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
  coverInfos: { data: ICoverInfo[] }
) => {
  const listManga = results.map((result: Result) => {
    const coverArt: ICoverInfo = coverInfos.data.find(
      (coverInfo: ICoverInfo) => {
        const mangaRelation = coverInfo.relationships.find(
          (relation) => relation.type === "manga"
        )!;
        return mangaRelation.id === result.id;
      }
    )!;
    return {
      id: result.id,
      title: result.attributes.title.en,
      description: result.attributes.description.en,
      urlImage: `https://uploads.mangadex.org/covers/${result.id}/${coverArt.attributes.fileName}`,
      status: result.attributes.status,
    };
  });
  return listManga;
};

export const getListChapter = async (mangaId: string, language = "en") => {
  const res = await axios.get(
    `/api/chapter/manga?mangaId=${mangaId}&offset=0&language=${language}`
  );

  const data = res.data;
  const { total } = data;
  const count = Math.floor(total / 100);
  let listChapter: Chapter[] = [];
  const promises = [];
  listChapter = listChapter.concat(data.data);

  for (let i = 1; i <= count; i++) {
    promises.push(
      axios
        .get(
          `/api/chapter/manga?mangaId=${mangaId}&offset=${
            i * 100
          }&language=${language}`
        )
        .then((res) => {
          listChapter = listChapter.concat(res.data.data);
        })
    );
  }

  await Promise.all(promises);
  listChapter.sort(
    (a: Chapter, b: Chapter) =>
      Number(a.attributes.chapter) - Number(b.attributes.chapter)
  );
  listChapter = listChapter.filter((chapter, index, array) => {
    if (!array[index + 1]) return true;
    return chapter.attributes.chapter !== array[index + 1].attributes.chapter;
  });
  return listChapter;
};
