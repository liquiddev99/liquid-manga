export type Manga = {
  id: string;
  title: string;
  status: string;
  description: string;
  urlImage: string;
};

export type Chapter = {
  result: string;
  id: string;
  type: string;
  attributes: {
    chapter: string;
    title: string;
    hash: string;
    publishAt: string;
  };
};

export type Result = {
  id: string;
  type: string;
  attributes: {
    title: { en: string };
    description: { en: string };
    status: string;
    tags: [];
    altTitles: [];
  };
  relationships: [{ id: string; type: string }];
};

export interface Tag {
  id: string;
  attributes: {
    name: { en: string };
  };
  type: string;
}

export type SubTag = {
  id: string;
  type: string;
  attributes: {
    name: {
      en: string;
    };
  };
};

export interface IResponse {
  data: Result[];
  limit: number;
  offset: number;
  total: number;
}

export interface IPropsListManga {
  mangaSuggest: Manga[];
  mangaSafe: Manga[];
}

export interface ICoverInfo {
  attributes: {
    fileName: string;
  };
  relationships: [{ id: string; type: string }];
}
