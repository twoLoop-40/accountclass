import type { NextApiRequest, NextApiResponse } from "next";
import { fetchData, pipe } from "../../src/lib/util";
import { start } from "repl";

type CountResponse = {
  ok: boolean;
  data?: ClassCount[];
};
export type ClassCount = {
  userCode: number;
  userName: string;
  lectureCount: number;
};

export default async function studentCountHandler(
  req: NextApiRequest,
  res: NextApiResponse<ClassCount[]>
) {
  const { startDay, endDay, sheetName } = req.query;
  const url = process.env.KONG_LECTURE_SS as string;
  try {
    const classCountResponse = await fetchData(url, {
      startDay,
      endDay,
      sheetName,
      type: "presenceInfoReq",
    });
    return pipe((parsed: CountResponse) => {
      return parsed.ok && parsed.data
        ? res.status(200).json(parsed.data)
        : res.status(404).json([]);
    })(classCountResponse);
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json([]);
  }
}
