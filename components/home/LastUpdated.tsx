import Link from "next/link";

import { Manga } from "../../interfaces/intefaces";
import ListManga from "../manga/ListManga";

export default function LastUpdated(props: { mangaSafe: Manga[] }) {
  return (
    <div className="container max-w-screen-xl">
      <p className="text-white text-3xl border-b border-opacity-40 border-white pb-3">
        Last Updated
      </p>
      <div className="responsive-list-manga mt-5">
        {props.mangaSafe.map((manga: Manga) => (
          <Link key={manga.id} href={`/manga/${manga.id}`}>
            <a>
              <ListManga manga={manga} isStatic={true} />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
