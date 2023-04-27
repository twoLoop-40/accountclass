import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { DateWithValidation, transformDate } from "../src/lib/makeDateArray";
import makeMonthFromNumber from "../src/lib/makeMonthFromNumber";
import { useCallback, useEffect, useMemo, useState } from "react";
import { pipe } from "../src/lib/util";
import { makeDatesAfterMonth } from "../src/lib/makeDateArray";
import { SetterOrUpdater } from "recoil";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
type CalendarProps = {
  days: DateWithValidation[];
  fullYear?: number;
  month: number;
  startDay?: string;
  setStartDay?: SetterOrUpdater<string>;
  endDay?: string;
  setEndDay?: SetterOrUpdater<string>;
};

// 월을 바꾸었을 때 달력을 다시 그리기 위한 hook
function useShiftMonth(initMonth: number, initFullYear: number) {
  const [step, setStep] = useState<number>(0);
  const [month, setMonth] = useState(initMonth);
  const [fullYear, setFullYear] = useState(initFullYear);
  const moveStep = useCallback(
    (direction: string) => {
      if (direction === "left") {
        setStep(() => step - 1);
        month - 1 < 0
          ? (setFullYear(() => fullYear - 1),
            setMonth(() => (month - 1 + 12) % 12))
          : setMonth(() => month - 1);
      } else if (direction === "right") {
        setStep(() => step + 1);
        month + 1 > 11
          ? (setFullYear(() => fullYear + 1),
            setMonth(() => (month + 1 + 12) % 12))
          : setMonth(() => month + 1);
      }
    },
    [fullYear, month, step]
  );
  const makeDates = useMemo(() => {
    return makeDatesAfterMonth(step);
  }, [step]);
  return { makeDates, moveStep, month, fullYear };
}

export default function Calendar({
  days: initDays,
  month: initMonth,
  fullYear: initFullYear,
  setStartDay,
  startDay,
  endDay,
  setEndDay,
}: CalendarProps) {
  const [days, setDays] = useState<DateWithValidation[]>(initDays);
  const { makeDates, moveStep, month, fullYear } = useShiftMonth(
    initMonth,
    initFullYear as number
  );
  const [selectedDate, setSelectedDate] = useState<string>("");

  // today 표시하기
  pipe(
    () => new Date(),
    (date: Date) => transformDate(date),
    (dateForm: string) => days.findIndex((day) => day.date === dateForm),
    (todayIdx: number) => {
      if (todayIdx === -1) return;
      days[todayIdx].isToday = true;
    }
  )(null);

  const onClick = (dayIdx: number) => {
    days.forEach((day) => (day.isSelected = false));
    dayIdx ? (days[dayIdx].isSelected = true) : null;
    setSelectedDate(days[dayIdx].date);
  };

  const onClickArrow = (direction: string) => {
    moveStep(direction);
  };

  useEffect(() => {
    initFullYear ? setDays(() => makeDates(initFullYear, initMonth)) : null;
  }, [initFullYear, initMonth, makeDates]);

  useEffect(() => {
    setStartDay
      ? setStartDay(selectedDate)
      : setEndDay
      ? setEndDay(selectedDate)
      : null;
  }, [selectedDate, setStartDay, setEndDay]);

  return (
    <div className='mt-10 w-full text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9'>
      <div className='mb-1 flex items-center justify-center font-semibold text-gray-900'>
        {fullYear} 년
      </div>
      <div className='flex items-center text-gray-900'>
        <button
          onClick={() => onClickArrow("left")}
          type='button'
          className='-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500'
        >
          <span className='sr-only'>Previous month</span>
          <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
        </button>
        <div className='flex-auto text-sm font-semibold'>
          {makeMonthFromNumber(month)}
        </div>
        <button
          onClick={() => onClickArrow("right")}
          type='button'
          className='-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500'
        >
          <span className='sr-only'>Next month</span>
          <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
        </button>
      </div>
      <div className='mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500'>
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className='isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200'>
        {days.map((day, dayIdx) => (
          <button
            onClick={() => onClick(dayIdx)}
            key={day.date}
            type='button'
            className={classNames(
              "py-1.5 hover:bg-gray-100 focus:z-10",
              day.isCurrentMonth ? "bg-white" : "bg-gray-50",
              (day.isSelected || day.isToday) && "font-semibold",
              day.isSelected && "text-white",
              !day.isSelected &&
                day.isCurrentMonth &&
                !day.isToday &&
                "text-gray-900",
              !day.isSelected &&
                !day.isCurrentMonth &&
                !day.isToday &&
                "text-gray-400",
              day.isToday && !day.isSelected && "text-indigo-600",
              dayIdx === 0 && "rounded-tl-lg",
              dayIdx === 6 && "rounded-tr-lg",
              dayIdx === days.length - 7 && "rounded-bl-lg",
              dayIdx === days.length - 1 && "rounded-br-lg"
            )}
          >
            <time
              dateTime={day.date}
              className={classNames(
                "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                day.isSelected && day.isToday && "bg-indigo-600",
                day.isSelected && !day.isToday && "bg-gray-900"
              )}
            >
              {day.date.split("-").pop()?.replace(/^0/, "")}
            </time>
          </button>
        ))}
      </div>
    </div>
  );
}
