import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let p = req.query.p as string;
    p = p || "1";
    let query = req.query.query as string;
    query = query.split("_").join("&");
    const response = await axios.get(
      `https://api.mangadex.org/manga?${query}&limit=100&offset=${
        (parseInt(p) - 1) * 100
      }`
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err.response, "error response");
    return res.status(404).json({ msg: "No results found" });
  }
};
