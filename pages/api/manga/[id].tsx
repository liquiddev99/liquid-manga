// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const response = await axios.get(
      `https://api.mangadex.org/chapter?manga=${id}&limit=100&translatedLanguage[]=en`
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err.response, "error response");
    return res.status(500).json({ msg: "Couldn't find this Manga" });
  }
};
