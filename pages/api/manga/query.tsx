import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // let { query, offset } = req.query;
    let query = req.query.query as string;
    console.log(req.query);
    query = query.split("_").join("&");
    const response = await axios.get(
      `https://api.mangadex.org/manga?${query}&limit=100`
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err.response, "error response");
    return res.status(404).json({ msg: "No results found" });
  }
};
