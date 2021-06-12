import { GetServerSideProps } from "next";
import Image from "next/image";
import { ParsedUrlQuery } from "querystring";
import useSWR from "swr";
import axios from "axios";
import NotFound from "../../components/error/NotFound";

interface IParams extends ParsedUrlQuery {
  id: string;
}

export default function Chapter(props: {
  id: string;
  base_url: string;
  temp_token: string;
}) {
  const { id, base_url, temp_token } = props;
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(`/api/chapter/${id}`, fetcher);
  // if (error && error.response.status === 404) return <NotFound />;
  if (!data) return <div className="h-screen">Loading...</div>;
  if (data) console.log(data.data.attributes);
  console.log(base_url, "baseurl");

  return (
    <div className="w-11/12 mx-auto flex flex-col items-center">
      {data.data.attributes.data.map((fileName: string) => (
        <div className="m-3" key={fileName}>
          <Image
            width={1000}
            height={1200}
            src={`${base_url}/${temp_token}/data/${data.data.attributes.hash}/${fileName}`}
            alt={data.data.attributes.chapter}
            layout="intrinsic"
            priority={true}
          />
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as IParams;
  return {
    props: {
      id,
      base_url: process.env.BASE_URL,
      temp_token: process.env.TEMP_TOKEN,
    },
  };
};
