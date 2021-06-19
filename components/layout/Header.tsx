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
      const data: Tag[] = res.data;
      data.sort((a: Tag, b: Tag) =>
        a.data.attributes.name.en.localeCompare(b.data.attributes.name.en)
      );
      setTags(data);
    });
  }, []);

  return (
    <div className="w-full bg-top relative">
      <div
        className={`absolute top-full z-20 left-0 w-screen bg-middle origin-top transition duration-500 transform md:hidden ${
          open ? "scale-y-100" : "scale-y-0"
        }`}
      >
        <div className="w-5/6 mx-auto">
          <form
            className="bg-white rounded items-center flex text-sm mt-3 justify-between mb-2"
            onSubmit={onSubmit}
          >
            <input
              placeholder="Search"
              className="text-gray-700 py-1 px-2 rounded outline-none border-none"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <button type="submit" className="px-2">
              <SearchIcon className="h-5 w-5" />
            </button>
          </form>
          <Link href="/">
            <a className="link">Home</a>
          </Link>
          <Link href="/advanced-search">
            <a className="link">Advanced Search</a>
          </Link>

          <div className="relative group">
            <div className="text-white text-sm md:text-base flex items-center cursor-pointer mb-2">
              Genres
              <ChevronDownIcon className="h-5 w-5" />
            </div>
            <div className="bg-bottom rounded text-white absolute top-full hidden group-hover:block w-full z-30">
              <div className="w-5/6 text-sm mx-auto grid grid-cols-2 gap-3 my-4">
                {tags &&
                  tags.map((tag: Tag) => (
                    <Link
                      key={tag.data.id}
                      href={`/search/includedTags[]=${tag.data.id}`}
                    >
                      <a onClick={() => setOpen(false)}>
                        {tag.data.attributes.name.en}
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
      <div className="container flex py-3 justify-between items-center z-30">
        <Link href="/">
          <a className="text-white text-2xl md:text-4xl font-dancing">
            Liquid Manga
          </a>
        </Link>
        <div
          className="md:hidden bg-white rounded cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <XIcon className="h-6 w-6 p-1" />
          ) : (
            <MenuIcon className="h-6 w-6 p-1" />
          )}
        </div>

        <div className="md:flex flex-row items-center hidden">
          <Link href="/">
            <a className="link">Home</a>
          </Link>
          <div className="relative group ml-4 md:ml-8">
            <div className="text-white text-sm md:text-base flex items-center cursor-pointer">
              Genres
              <ChevronDownIcon className="h-5 w-5" />
            </div>
            <div className="bg-middle rounded text-white absolute top-full hidden group-hover:block w-3-quarter-screen z-10 -right-96">
              <div className="w-full grid grid-cols-6 gap-2 my-4">
                {tags &&
                  tags.map((tag: Tag) => (
                    <Link
                      key={tag.data.id}
                      href={`/search/includedTags[]=${tag.data.id}`}
                    >
                      <a className="text-center">
                        {tag.data.attributes.name.en}
                      </a>
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
            className="bg-white rounded ml-8 items-center hidden md:flex"
            onSubmit={onSubmit}
          >
            <input
              placeholder="Search"
              className="text-gray-700 py-1 px-2 rounded outline-none border-none"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <button type="submit" className="px-2">
              <SearchIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Header;
