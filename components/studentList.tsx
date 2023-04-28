import { useEffect, useState } from "react";
import { pipe } from "../src/lib/util";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import PageButtons from "./pageButtons";

type PageStep = 1 | -1;

function usePagination(studentsList: StudentLectureCount[], perPage?: number) {
  perPage = perPage ? perPage : 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);

  const getCurrentDataOfCurrentPage: (page: number) => StudentLectureCount[] =
    pipe(
      (page: number) => [
        (page - 1) * (perPage as number),
        page * (perPage as number),
      ],
      ([start, end]: [start: number, end: number]) => {
        const result = studentsList.slice(start, end);
        return result;
      }
    );
  const onCurrentPageClick = (page: number) => {
    setCurrentPage(() => page);
  };
  const onPageMoveClick = (step: PageStep) => {
    setCurrentPage((prev) => {
      const next = prev + step;
      if (next > maxPage || next < 1) return prev;
      return next;
    });
  };
  return {
    currentPage,
    onCurrentPageClick,
    onPageMoveClick,
    getCurrentDataOfCurrentPage,
    maxPage,
    setMaxPage,
  };
}
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
  const PER_PAGE = 15;
  const {
    currentPage,
    getCurrentDataOfCurrentPage,
    onCurrentPageClick,
    maxPage,
    setMaxPage,
    onPageMoveClick,
  } = usePagination(studentsLectureCount, PER_PAGE);

  useEffect(() => {
    studentsLectureCount
      ? setMaxPage(() => {
          const newMaxPage = Math.ceil(studentsLectureCount.length / PER_PAGE);
          return newMaxPage;
        })
      : null;
    return () => {
      setMaxPage(0);
    };
  }, [setMaxPage, studentsLectureCount]);
  console.log(maxPage);
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
                {getCurrentDataOfCurrentPage(currentPage).map(
                  (student, personIdx) => (
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
                  )
                )}
              </tbody>
            </table>
            <div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
              <div className='flex flex-1 justify-between sm:hidden'>
                <button
                  onClick={() => onPageMoveClick(-1)}
                  className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageMoveClick(+1)}
                  className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                >
                  Next
                </button>
              </div>
            </div>
            <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-end'>
              <nav
                className='isolate inline-flex -space-x-px rounded-md shadow-sm'
                aria-label='Pagination'
              >
                {/* <a
                  href='#'
                  className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                >
                  <span className='sr-only'>Previous</span>
                  <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
                </a> */}
                <div>
                  <PageButtons
                    currentPage={currentPage}
                    buttonNumber={maxPage}
                    onCurrentPageClick={onCurrentPageClick}
                  />
                </div>

                {/* <a
                  href='#'
                  className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                >
                  <span className='sr-only'>Next</span>
                  <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
                </a> */}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
