// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchData, pipe } from "../../src/lib/util";

type LectureResponse = {
  ok: boolean;
  data?: Lecture[];
};
type Lecture = {
  id: number;
  lectureName: string;
};

export default async function lectureNameHandler(
  req: NextApiRequest,
  res: NextApiResponse<Lecture[]>
) {
  const url = process.env.KONG_LECTURE_SS as string;
  const lectureNameList = (await fetchData(url, {
    type: "lectureName",
  })) as LectureResponse;
  return pipe((parsed: LectureResponse) => {
    return parsed.ok && parsed.data
      ? res.status(200).json(parsed.data)
      : res.status(404).json([]);
  })(lectureNameList);
}
