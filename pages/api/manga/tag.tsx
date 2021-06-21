import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function GetTags(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get("https://api.mangadex.org/manga/tag");
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err.response, "error response");
    return res.status(404).json({ msg: "No results found" });
  }
}
