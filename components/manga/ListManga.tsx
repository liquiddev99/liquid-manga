import Image from "next/image";

import { Manga } from "../../interfaces/intefaces";

export default function ListManga(props: { manga: Manga }) {
  const { manga } = props;
  return (
    <div
      className="bg-white overflow-hidden rounded-t-md flex flex-col h-full"
      key={manga.id}
    >
      <Image
        src={manga.urlImage}
        width={175}
        height={220}
        layout="responsive"
      />
      <div className="m-2 flex flex-col justify-between flex-grow">
        <p className="text-base font-bold text-gray-800 line-clamp-2">
          {manga.title}
        </p>
        <div>
          <p
            className={`text-sm text-gray-500 capitalize ${
              manga.status === "ongoing" && "text-green-700"
            }`}
          >
            {manga.status}
          </p>
        </div>
      </div>
    </div>
  );
}
