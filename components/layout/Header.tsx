import { MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function Header() {
  const router = useRouter();
  const onSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/search");
  };

  return (
    <div className="w-full bg-top">
      <div className="flex mx-auto w-11/12 py-3 justify-between items-center">
        <Link href="/">
          <a className="text-white text-4xl font-dancing">Liquid Manga</a>
        </Link>
        <div className="flex flex-row items-center">
          <Link href="/">
            <a className="link">Home</a>
          </Link>
          <Link href="#">
            <a className="link">
              Genres
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>
          </Link>
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
            />
            <button type="submit" className="px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Header;
