import { useState, MouseEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SearchIcon, ChevronDownIcon } from "@heroicons/react/outline";
import axios from "axios";

interface Tag {
  result: string;
  data: {
    attributes: {
      name: { en: string };
    };
    id: string;
    type: string;
  };
}

function Header() {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState([]);
  const router = useRouter();
  const onSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    router.push(`/search?title=${input}`);
  };

  useEffect(() => {
    axios.get("https://api.mangadex.org/manga/tag").then((res) => {
      const data = res.data;
      data.sort((a: Tag, b: Tag) =>
        a.data.attributes.name.en.localeCompare(b.data.attributes.name.en)
      );
      setTags(data);
    });
  }, []);

  return (
    <div className="w-full bg-top">
      <div className="container flex py-3 justify-between items-center">
        <Link href="/">
          <a className="text-white text-4xl font-dancing">Liquid Manga</a>
        </Link>
        <div className="flex flex-row items-center">
          <Link href="/">
            <a className="link">Home</a>
          </Link>
          <div className="relative group ml-8">
            <div className="text-white text-base flex items-center cursor-pointer">
              Genres
              <ChevronDownIcon className="h-5 w-5" />
            </div>
            <div className="bg-white rounded text-black absolute top-full hidden group-hover:block w-3-quarter-screen z-10 -right-96">
              <div className="w-full grid grid-cols-6 gap-2 my-4">
                {tags &&
                  tags.map((tag: Tag) => (
                    <Link href={`/search/includedTags[]=${tag.data.id}`}>
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
            className="bg-white rounded ml-8 flex items-center"
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
