import Image from "next/image";
import { useState } from "react";

import { Manga } from "../../interfaces/intefaces";
import loadingImg from "../../public/loading.jpeg";

export default function ListManga(props: { manga: Manga; isStatic?: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const { manga, isStatic } = props;

  return (
    <div
      className="bg-white overflow-hidden rounded-t-md flex flex-col h-full"
      key={manga.id}
    >
      <div className={`${isLoaded || isStatic ? null : "hidden"}`}>
        <Image
          src={manga.urlImage}
          width={175}
          height={220}
          alt="Manga Cover Image"
          priority={true}
          onLoad={() => {
            setIsLoaded(true);
          }}
          quality={10}
        />
      </div>
      {!isStatic && (
        <div className={`${isLoaded ? "hidden" : null}`}>
          <Image
            src={loadingImg}
            quality={10}
            alt="Loading..."
            width={175}
            height={220}
          />
        </div>
      )}
      <div className="m-2 flex flex-col justify-between flex-grow">
        <p className="text-base font-bold text-gray-800 line-clamp-2">
          {manga.title ? manga.title : "Updating name..."}
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
