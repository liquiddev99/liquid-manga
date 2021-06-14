// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let { id, offset, language } = req.query;
    const response = await axios.get(
      `https://api.mangadex.org/chapter?manga=${id}&offset=${offset}&limit=100&translatedLanguage[]=${language}`
    );
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err.response, "error response");
    return res.status(404).json({ msg: "Couldn't find this Manga" });
  }
};
