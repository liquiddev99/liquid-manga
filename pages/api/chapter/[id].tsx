// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  console.log(req.query.id);
  const response = await axios.get(`https://api.mangadex.org/chapter/${id}`);
  res.status(200).json(response.data);
};
