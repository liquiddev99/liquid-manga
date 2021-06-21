import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

interface PropsPagination {
  totalPage: number;
  p: number;
}

export default function Pagination(props: PropsPagination) {
  const { p, totalPage } = props;
  const [basePath, setBasePath] = useState("");
  const [queryFilteredP, setQueryFilteredP] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    let asPathArray = router.asPath.split("?");
    setBasePath(asPathArray[0]);

    let queryParams = asPathArray[1];
    if (queryParams) {
      let filteredP = queryParams
        .split("&")
        .filter((a) => a !== `p=${p}`)
        .join("&");

      setQueryFilteredP(filteredP);
    }
  }, [router.isReady, router.asPath, p]);

  const range = (start: number, end: number): number[] => {
    return Array(end - start + 1)
      .fill(0)
      .map((_, idx) => start + idx);
  };

  const prevPage = () => {
    router.push(
      `${basePath}?p=${p - 1}${queryFilteredP ? "&" + queryFilteredP : ""}`,
      undefined,
      { shallow: true }
    );
  };

  const nextPage = () => {
    router.push(
      `${basePath}?p=${p + 1}${queryFilteredP ? "&" + queryFilteredP : ""}`,
      undefined,
      { shallow: true }
    );
  };

  const changePage = (p: number) => {
    router.push(
      `${basePath}?p=${p}${queryFilteredP ? "&" + queryFilteredP : ""}`,
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className="mx-auto mt-10 flex justify-center">
      {p - 3 > 1 && (
        <div className="paginate bg-white" onClick={() => prevPage()}>
          <ChevronLeftIcon className="h-4 w-4" />
        </div>
      )}
      {p - 2 > 1 && (
        <div className="paginate bg-white" onClick={() => changePage(1)}>
          1
        </div>
      )}
      {p - 3 > 1 && <div className="paginate bg-white">...</div>}
      {range(p - 2, p + 2).map((number, index) => (
        <>
          {number >= 1 && number <= totalPage ? (
            <div
              className={`paginate${
                p === number ? " bg-green-500 text-white" : " bg-white"
              }`}
              key={index}
              onClick={() => {
                changePage(number);
              }}
            >
              {number}
            </div>
          ) : null}
        </>
      ))}
      {p + 3 < totalPage && <div className="paginate bg-white">...</div>}
      {p + 2 < totalPage && (
        <div
          className="paginate bg-white"
          onClick={() => changePage(totalPage)}
        >
          {totalPage}
        </div>
      )}
      {p + 3 < totalPage && (
        <div className="paginate bg-white" onClick={() => nextPage()}>
          <ChevronRightIcon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
