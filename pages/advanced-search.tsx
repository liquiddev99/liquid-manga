import { useState, ChangeEvent } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import axios from "axios";

import { Tag } from "../interfaces/intefaces";
import { useRouter } from "next/router";

function AdvancedSearch(props: { tags: Tag[] }) {
  const router = useRouter();
  const { tags } = props;
  // const [query, setQuery] = useState("");
  const [idTags, setIdTags] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    let ids = idTags;
    if (e.target.checked) {
      ids.push(e.target.id);
    } else {
      ids = ids.filter((id) => id !== e.target.id);
    }
    setIdTags(ids);
  };

  const handleStatus = (e: ChangeEvent<HTMLInputElement>) => {
    let values = status;
    if (e.target.checked) {
      values.push(e.target.value);
    } else {
      values = values.filter((value) => value !== e.target.value);
    }
    setStatus(values);
  };

  const handleSearch = () => {
    if (!idTags.length && !status.length) return;

    let query = "";
    if (status.length) {
      let statusQuery = "status[]=" + status.join("_status[]=");
      query += statusQuery;
    }
    if (idTags.length) {
      let tagsQuery = "includedTags[]=" + idTags.join("_includedTags[]=");
      if (query) tagsQuery = "_" + tagsQuery;
      query += tagsQuery;
    }
    router.push(`/search/${query}`);
  };

  return (
    <>
      <Head>
        <title>Liquid Manga | Advanced Search</title>
      </Head>
      <div className="container text-white">
        <p className="mt-4 text-2xl border-b border-opacity-40 border-white pb-3">
          Advanced Search
        </p>

        <p className="text-xl mt-3">Genres</p>
        <div className="w-full grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 mt-2">
          {tags &&
            tags.map((tag) => (
              <div key={tag.data.id} className="flex flex-row items-center">
                <input
                  type="checkbox"
                  id={tag.data.id}
                  className="mr-1"
                  name="includedTags[]"
                  value={tag.data.id}
                  onChange={handleCheck}
                />
                <label htmlFor={tag.data.id}>
                  {tag.data.attributes.name.en}
                </label>
              </div>
            ))}
        </div>
        <p className="text-xl mt-3">Status</p>
        <div className="w-full grid grid-cols-2 md:grid-cols-7 gap-2 mt-2">
          <div className="flex flex-row items-center mr-3">
            <input
              type="checkbox"
              id="1"
              className="mr-1"
              name="status[]"
              value="ongoing"
              onChange={handleStatus}
            />
            <label htmlFor="1">Ongoing</label>
          </div>
          <div className="flex flex-row items-center mr-3">
            <input
              type="checkbox"
              id="2"
              className="mr-1"
              name="status[]"
              value="completed"
              onChange={handleStatus}
            />
            <label htmlFor="2">Completed</label>
          </div>
          <div className="flex flex-row items-center mr-3">
            <input
              type="checkbox"
              id="3"
              className="mr-1"
              name="status[]"
              value="hiatus"
              onChange={handleStatus}
            />
            <label htmlFor="3">Hiatus</label>
          </div>
          <div className="flex flex-row items-center mr-3">
            <input
              type="checkbox"
              id="4"
              className="mr-1"
              name="status[]"
              value="cancelled"
              onChange={handleStatus}
            />
            <label htmlFor="4">Cancelled</label>
          </div>
        </div>

        <button
          className="py-2 px-3 mt-5 rounded uppercase font-semibold text-sm bg-green-500"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </>
  );
}

export default AdvancedSearch;

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get(`${process.env.BASE_URL_DEX}/manga/tag`);
  const tags: Tag[] = res.data;
  tags.sort((a: Tag, b: Tag) =>
    a.data.attributes.name.en.localeCompare(b.data.attributes.name.en)
  );

  return { props: { tags }, revalidate: 5 };
};
