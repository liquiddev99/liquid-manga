import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function GetImageChapter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const chapter = await axios.get(
      `https://api.mangadex.org/at-home/server/${id}`
    );
    res.status(200).json(chapter.data);
  } catch (err) {
    return res.status(404).json({ msg: "Couldn't find this chapter" });
  }
}
