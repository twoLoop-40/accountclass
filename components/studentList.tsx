const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

export type StudentLectureCount = {
  userCode: number;
  userName: string;
  lectureCount: number;
};

type StudentCountProps = {
  studentsLectureCount: StudentLectureCount[];
};

export default function StudentCount({
  studentsLectureCount,
}: StudentCountProps) {
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          {/* <h1 className='text-base font-semibold leading-6 text-gray-900'>
            
          </h1> */}
          <p className='text-md mt-2 font-semibold text-gray-700'>
            수업 참여 학생 목록과 출석 횟수입니다.
          </p>
        </div>
        <div className='mt-4 sm:ml-16 sm:mt-0 sm:flex-none'>
          <p className='text-md mt-2 font-semibold text-gray-700'>
            {`전체 학생 수: ${studentsLectureCount.length}`}
          </p>
          <p className='text-md mt-2 font-semibold text-gray-700'>
            {`전체 학생 참여 횟수: ${studentsLectureCount.reduce(
              (acc, curr) => {
                return acc + curr.lectureCount;
              },
              0
            )}`}
          </p>
        </div>
      </div>
      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3'
                  >
                    학생 코드
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    학생 이름
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    출석횟수
                  </th>
                  {/* <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-3'>
                    <span className='sr-only'>Edit</span>
                  </th> */}
                </tr>
              </thead>
              <tbody className='bg-white'>
                {studentsLectureCount.map((student, personIdx) => (
                  <tr
                    key={personIdx}
                    className={personIdx % 2 === 0 ? undefined : "bg-gray-50"}
                  >
                    <td className='mx-auto whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3'>
                      {student.userCode}
                    </td>
                    <td className='mx-auto whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                      {student.userName}
                    </td>
                    <td className='mx-auto whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                      {student.lectureCount}
                    </td>
                    {/* <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3'>
                      <a
                        href='#'
                        className='text-indigo-600 hover:text-indigo-900'
                      >
                        Edit<span className='sr-only'>, {person.name}</span>
                      </a>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
