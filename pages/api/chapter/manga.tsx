// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let { mangaId, offset, language } = req.query;
    const response = await axios.get(
      `https://api.mangadex.org/chapter?manga=${mangaId}&offset=${offset}&limit=100&translatedLanguage[]=${language}`
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err.response, "error response");
    return res.status(404).json({ msg: "Couldn't find this Manga" });
  }
};
