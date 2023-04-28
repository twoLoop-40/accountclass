import { Fragment, useEffect, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { addLocalStorage, classNames, fetchData } from "../src/lib/util";
import { useRecoilState } from "recoil";
import { lectureNameState } from "../src/recoil/atoms";

type Lecture = {
  id: number;
  lectureName: string;
};

function useLectureName() {
  const lectureNameInit: Lecture = useMemo(
    () => ({ id: 0, lectureName: "수업을 선택하세요" }),
    []
  );

  const [lectureNameList, setLectureNameList] = useState<Lecture[]>();
  const url = "api/getLectureNameList";
  useEffect(() => {
    fetchData<string, Lecture[]>(url)
      .then((nameList: Lecture[] | undefined) => {
        nameList
          ? setLectureNameList(() => [...nameList])
          : setLectureNameList(() => [lectureNameInit]);
        return nameList;
      })
      .catch((err) => {
        console.log(err);
      });
  }, [lectureNameInit]);
  return lectureNameList;
}

export default function SelectClass() {
  const [selectedLecture, setSelectedLecture] =
    useRecoilState<Lecture>(lectureNameState);
  const lectureNameList = useLectureName();
  const setSelectLectureStorage = addLocalStorage<Lecture>(
    "lectureName",
    setSelectedLecture
  );

  // const lectureNameList = await fetchData<unknown, Lecture[]>(url);
  const onListboxChange = (lecture: Lecture) => {
    lecture.id !== 0 ? setSelectLectureStorage(lecture) : null;
  };

  return (
    <Listbox
      value={selectedLecture}
      onChange={(lecture) => onListboxChange(lecture)}
    >
      {({ open }) => (
        <>
          <div className='md: relative mx-auto mt-2 w-96'>
            <Listbox.Button className='relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'>
              <span className='block truncate'>
                {selectedLecture ? selectedLecture.lectureName : null}
              </span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                <ChevronUpDownIcon
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {lectureNameList?.map((lecture) => (
                  <Listbox.Option
                    key={lecture.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={lecture}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {lecture?.lectureName}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
