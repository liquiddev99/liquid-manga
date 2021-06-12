import { ICoverInfo, Result } from "../interfaces/intefaces";

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
      urlImage: `${process.env.BASE_URL_IMG}/${result.data.id}/${coverArt.data.attributes.fileName}`,
      status: result.data.attributes.status,
    };
  });
  return listManga;
};
