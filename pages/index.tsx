import { useRecoilValue } from "recoil";
import Layout from "../components/frame";
import StudentCount from "../components/studentList";
import { loadingState, studentAttendanceCountState } from "../src/recoil/atoms";
import Loading from "../components/loading";

function Home() {
  const studentsLectureCount = useRecoilValue(studentAttendanceCountState);
  const isMainLoading = useRecoilValue(loadingState);
  return (
    <Layout>
      {isMainLoading ? (
        <Loading />
      ) : (
        <StudentCount {...{ studentsLectureCount }} />
      )}
    </Layout>
  );
}

export default Home;
