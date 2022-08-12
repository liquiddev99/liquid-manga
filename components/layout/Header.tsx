import { useState, MouseEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  SearchIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import axios from "axios";

import { Tag } from "../../interfaces/intefaces";

function Header() {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const onSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    setOpen(false);
    router.push(`/search?title=${input}`);
  };

  useEffect(() => {
    axios.get("/api/manga/tag").then((res) => {
      const data: Tag[] = res.data.data;
      data.sort((a: Tag, b: Tag) =>
        a.attributes.name.en.localeCompare(b.attributes.name.en)
      );
      setTags(data);
    });
  }, []);

  return (
    <div className="relative w-full bg-top">
      <div
        className={`absolute top-full z-20 left-0 w-screen bg-middle origin-top transition duration-500 transform lg:hidden ${
          open ? "scale-y-100" : "scale-y-0"
        }`}
      >
        <div className="w-5/6 mx-auto">
          <form
            className="flex items-center justify-between mt-3 mb-2 text-sm bg-white rounded"
            onSubmit={onSubmit}
          >
            <input
              placeholder="Search"
              className="px-2 py-1 text-gray-700 border-none rounded outline-none"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <button type="submit" className="px-2">
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
          <Link href="/">
            <a onClick={() => setOpen(false)} className="link">
              Home
            </a>
          </Link>
          <Link href="/advanced-search">
            <a onClick={() => setOpen(false)} className="link">
              Advanced Search
            </a>
          </Link>

          <div className="relative group">
            <div className="flex items-center mb-2 text-sm text-white cursor-pointer md:text-base">
              Genres
              <ChevronDownIcon className="w-5 h-5" />
            </div>
            <div className="absolute z-30 hidden w-full text-white bg-bottom rounded top-full group-hover:block">
              <div className="w-5/6 mx-auto my-4 text-sm grid grid-cols-2 md:grid-cols-3 gap-3">
                {tags &&
                  tags.map((tag: Tag) => (
                    <Link
                      key={tag.id}
                      href={`/search/includedTags[]=${tag.id}`}
                    >
                      <a onClick={() => setOpen(false)}>
                        {tag.attributes.name.en}
                      </a>
                    </Link>
                  ))}

                <Link href="/search/status[]=completed">
                  <a onClick={() => setOpen(false)}>Full</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container max-w-screen-xl z-30 flex items-center justify-between py-3">
        <Link href="/">
          <a className="text-3xl text-white md:text-4xl font-dancing">
            Liquid Manga
          </a>
        </Link>
        <div
          className="bg-white rounded cursor-pointer lg:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <XIcon className="w-6 h-6 p-1" />
          ) : (
            <MenuIcon className="w-6 h-6 p-1" />
          )}
        </div>

        <div className="flex-row items-center hidden lg:flex">
          <Link href="/">
            <a className="link">Home</a>
          </Link>
          <div className="relative ml-4 group md:ml-8">
            <div className="flex items-center text-sm text-white cursor-pointer md:text-base">
              Genres
              <ChevronDownIcon className="w-5 h-5" />
            </div>
            <div className="absolute z-10 hidden text-white rounded bg-middle top-full group-hover:block w-3-quarter-screen -right-96">
              <div className="w-full my-4 grid lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {tags &&
                  tags.map((tag: Tag) => (
                    <Link
                      key={tag.id}
                      href={`/search/includedTags[]=${tag.id}`}
                    >
                      <a className="text-center">{tag.attributes.name.en}</a>
                    </Link>
                  ))}

                <Link href="/search/status[]=completed">
                  <a className="text-center">Full</a>
                </Link>
              </div>
            </div>
          </div>
          <Link href="/advanced-search">
            <a className="link">Advanced Search</a>
          </Link>

          <form
            className="items-center hidden ml-8 bg-white rounded md:flex"
            onSubmit={onSubmit}
          >
            <input
              placeholder="Search"
              className="px-2 py-1 text-gray-700 border-none rounded outline-none"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <button type="submit" className="px-2">
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Header;
