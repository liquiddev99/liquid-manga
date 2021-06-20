import Link from "next/link";

import { Manga } from "../../interfaces/intefaces";
import ListManga from "../manga/ListManga";

export default function LastUpdated(props: { mangaSafe: Manga[] }) {
  return (
    <div className="container">
      <p className="text-white text-3xl border-b border-opacity-40 border-white pb-3">
        Last Updated
      </p>
      <div className="grid md:grid-cols-6 grid-cols-2 md:gap-6 gap-3 mt-5">
        {props.mangaSafe.map((manga: Manga) => (
          <Link key={manga.id} href={`/manga/${manga.id}`}>
            <a>
              <ListManga manga={manga} />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
