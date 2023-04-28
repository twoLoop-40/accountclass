import { Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowDownTrayIcon,
  Bars3Icon,
  CalendarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import SelectClass from "./selectClass";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  endDayState,
  lectureNameState,
  startDayState,
  studentAttendanceCountState,
} from "../src/recoil/atoms";

import { StudentLectureCount } from "./studentList";
import { classNames, pipe, fetchData } from "../src/lib/util";
import Loading from "./loading";

const navigation = [
  {
    name: "수업 시작 날짜",
    href: "/modal/startDay",
    icon: CalendarIcon,
    current: false,
  },
  {
    name: "수업 종료 날짜",
    href: "/modal/endDay",
    icon: CalendarIcon,
    current: false,
  },
];

function useLocalStorage(key: string, value: string) {
  const [saved, setSaved] = useState("");
  const getSavedValue = pipe(
    (storageKey: string) => localStorage.getItem(storageKey),
    (stored: string | null) => (stored ? setSaved(JSON.parse(stored)) : null)
  );

  useEffect(() => {
    getSavedValue(key);
  }, [key, getSavedValue]);
  return saved ? saved : value;
}

type LayoutProps = {
  children?: React.ReactNode;
};

interface FetchDataParams {
  startDay: string;
  endDay: string;
  sheetName: string;
}
export default function Layout({ children }: LayoutProps) {
  const url = "api/studentCount";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setLectureAttendanceCount = useSetRecoilState(
    studentAttendanceCountState
  );

  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: (params: FetchDataParams) =>
      fetchData<FetchDataParams, StudentLectureCount[]>(url, params),
  });

  const startDay = useRecoilValue(startDayState);
  const endDay = useRecoilValue(endDayState);

  const startDayWithStorage = useLocalStorage("startDayStorage", startDay);
  const endDayWithStorage = useLocalStorage("endDayStorage", endDay);

  const lecture = useRecoilValue(lectureNameState);
  const onSendDateClick = async () => {
    const params = {
      startDay,
      endDay,
      sheetName: lecture.lectureName,
    };
    try {
      const result = await mutateAsync(params);
      result && !isLoading ? setLectureAttendanceCount(result) : null;
    } catch (err) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-50 lg:hidden'
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-900/80' />
            </Transition.Child>

            <div className='fixed inset-0 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                      <button
                        type='button'
                        className='-m-2.5 p-2.5'
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <XMarkIcon
                          className='h-6 w-6 text-white'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className=' flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4'>
                    <nav className='mt-5 flex flex-1 flex-col'>
                      <ul role='list' className='-mx-2 space-y-1'>
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "h-6 w-6 shrink-0"
                                )}
                                aria-hidden='true'
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                        <li className='group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700'>
                          {startDayWithStorage
                            ? `수업시작일: ${startDayWithStorage}`
                            : null}
                        </li>
                        <li className='group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700'>
                          {endDayWithStorage ? `수업종료일: ${endDay}` : null}
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4'>
            <nav className='mt-5 flex flex-1 flex-col'>
              <ul role='list' className='-mx-2 space-y-1'>
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? "text-indigo-600"
                            : "text-gray-400 group-hover:text-indigo-600",
                          "h-6 w-6 shrink-0"
                        )}
                        aria-hidden='true'
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li className='group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700'>
                  {startDay ? `수업시작일: ${startDay}` : null}
                </li>
                <li className='group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700'>
                  {endDay ? `수업종료일: ${endDay}` : null}
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className='lg:pl-72'>
          <div className='sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8'>
            <div className='flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none'>
              <button
                type='button'
                className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
                onClick={() => setSidebarOpen(true)}
              >
                <span className='sr-only'>Open sidebar</span>
                <Bars3Icon className='h-6 w-6' aria-hidden='true' />
              </button>

              {/* Separator */}
              <div
                className='h-6 w-px bg-gray-200 lg:hidden'
                aria-hidden='true'
              />

              <div className='mt-2 flex flex-1 gap-x-4 self-stretch lg:gap-x-6'>
                <SelectClass />
                <div className='flex items-center gap-x-4 lg:gap-x-6'>
                  <button
                    onClick={onSendDateClick}
                    type='button'
                    className='-m-2.5 p-2.5 text-gray-400 hover:text-gray-500'
                  >
                    <span className='sr-only'>View notifications</span>
                    <ArrowDownTrayIcon className='h-6 w-6' aria-hidden='true' />
                  </button>

                  {/* Separator */}
                  <div
                    className='hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200'
                    aria-hidden='true'
                  />

                  {/* Profile dropdown */}
                </div>
              </div>
            </div>
          </div>

          <main className='py-10'>
            <div className='mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
              {isLoading ? <Loading /> : children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
