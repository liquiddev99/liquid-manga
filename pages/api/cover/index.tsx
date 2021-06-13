// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const coverIds: string = req.query.coverIds as string;
    console.log(typeof coverIds, "typeof coverIds");
    const coverIdsArray = coverIds.split(",");
    const queryIds = "?ids[]=" + coverIdsArray.join("&ids[]=");

    const response = await axios.get(
      `https://api.mangadex.org/cover${queryIds}&limit=100`
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.log(err.response, "error response");
    return res.status(404).json({ msg: "No results found" });
  }
};
