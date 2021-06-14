export type Manga = {
  id: string;
  title: string;
  status: string;
  description: string;
  urlImage: string;
};

export type Chapter = {
  result: string;
  data: {
    id: string;
    type: string;
    attributes: {
      chapter: string;
      title: string;
      hash: string;
      publishAt: string;
    };
  };
};

export type Result = {
  result: string;
  data: {
    id: string;
    type: string;
    attributes: {
      title: { en: string };
      description: { en: string };
      status: string;
      tags: [];
      altTitles: [];
    };
  };
  relationships: [{ id: string; type: string }];
};

export type Tag = {
  id: string;
  type: string;
  attributes: {
    name: {
      en: string;
    };
  };
};

export interface IResponse {
  results: Result[];
  limit: number;
  offset: number;
  total: number;
}

export interface IPropsListManga {
  mangaSuggest: Manga[];
  mangaSafe: Manga[];
}

export interface ICoverInfo {
  result: string;
  data: {
    attributes: {
      fileName: string;
    };
  };
  relationships: [{ id: string; type: string }];
}
