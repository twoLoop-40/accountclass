import { pipe } from "./util";

// fullYear, month => firstDay in getTime()
function getFirstDay({
  fullYear,
  month,
}: {
  fullYear: number;
  month: number;
}): Date {
  return new Date(fullYear, month);
}

// date => Sunday
function getBeginningSunday(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay()
  );
}

// 이전달 마지막 일요일 부터 이번달 마지막 일요일까지 날짜 배열
function makeDateArray({
  startingDay,
  numOfDates,
}: {
  startingDay: Date;
  numOfDates: number;
}): Date[] {
  const dateArray = [];
  for (let i = 0; i < numOfDates; i++) {
    dateArray.push(
      new Date(
        startingDay.getFullYear(),
        startingDay.getMonth(),
        startingDay.getDate() + i
      )
    );
  }
  return dateArray;
}

interface InputDate {
  fullYear: number;
  month: number;
}
// date => makeDateArray
function makeDateArrayFromStartingMonth(fullYear: number, month: number) {
  const dateArray: Date[] = pipe<InputDate, Date[]>(
    getFirstDay,
    (firstDay: Date) => {
      const startingDay = getBeginningSunday(firstDay);
      const numOfDates = 42;
      return { startingDay, numOfDates };
    },
    makeDateArray
  )({ fullYear, month });
  return <T>(transformDate: (date: Date) => T) => dateArray.map(transformDate);
}

export function transformDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export type DateWithValidation = {
  date: string;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};

function transformDateWithValidation(
  transformDate: (dateArg: Date) => string,
  isCurrent: (date: Date) => boolean
): (dateArg: Date) => DateWithValidation {
  return (dateArg: Date) => {
    const date = transformDate(dateArg);
    if (isCurrent(dateArg)) {
      return { date, isCurrentMonth: true };
    } else {
      return { date, isCurrentMonth: false };
    }
  };
}

export function getDatesWithCurrentMonth(
  fullYear: number,
  month: number
): DateWithValidation[] {
  const dateArrayProc = makeDateArrayFromStartingMonth(fullYear, month);
  const transform = transformDateWithValidation(
    transformDate,
    (date) => date.getMonth() === month
  );
  return dateArrayProc(transform);
}

export function makeDatesAfterMonth(numOfMonth: number) {
  return (fullYear: number, month: number) => {
    const date = new Date(fullYear, month);
    date.setMonth(date.getMonth() + numOfMonth);
    return getDatesWithCurrentMonth(date.getFullYear(), date.getMonth());
  };
}
