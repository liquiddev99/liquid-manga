// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
// https://api.mangadex.org/chapter?manga=${manga.id}&limit=100&translatedLanguage[]=en
type Data = {
  name: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  console.log(req.query.id);
  const response = await axios.get(
    `https://api.mangadex.org/chapter?manga=${id}&limit=100&translatedLanguage[]=en`
  );
  res.status(200).json({ data: response.data });
};
