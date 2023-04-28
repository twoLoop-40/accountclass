import { useRecoilValue } from "recoil";
import Layout from "../components/frame";
import StudentCount from "../components/studentList";
import { studentAttendanceCountState } from "../src/recoil/atoms";

function Home() {
  const studentsLectureCount = useRecoilValue(studentAttendanceCountState);

  return (
    <Layout>
      {studentsLectureCount.length === 0 ? null : (
        <StudentCount {...{ studentsLectureCount }} />
      )}
    </Layout>
  );
}

export default Home;
