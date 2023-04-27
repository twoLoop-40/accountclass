import { useRecoilValue } from "recoil";
import Layout from "../components/Layout";
import StudentCount from "../components/studentList";
import { studentAttendanceCountState } from "../src/recoil/atoms";

function Home() {
  const studentsLectureCount = useRecoilValue(studentAttendanceCountState);
  return (
    <Layout>
      {studentsLectureCount.length > 0 ? (
        <StudentCount {...{ studentsLectureCount }} />
      ) : null}
    </Layout>
  );
}

export default Home;
