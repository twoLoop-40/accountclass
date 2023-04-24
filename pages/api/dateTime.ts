// 함수 파이프 라인으로 연결하고 에러 처리하기
function pipe(...fns: any[]) {
  return (x: any) => {
    try {
      return fns.reduce((v, f) => f(v), x);
    } catch (e) {
      console.error(e);
    }
  };
}

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
function getStartingDay(date: Date): Date {
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

// date => makeDateArray
function makeDateArrayFromStartingMonth(fullYear: number, month: number) {
  const dateArray: Date[] = pipe(
    getFirstDay,
    (firstDay: Date) => {
      const startingDay = getStartingDay(firstDay);
      const numOfDates = 42;
      return { startingDay, numOfDates };
    },
    makeDateArray
  )({ fullYear, month });
  return <T>(transformDate: (date: Date) => T) => dateArray.map(transformDate);
}

function transformDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

type DateWithValidation = {
  date: string;
  isCurrentMonth: boolean;
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
  const dateArray = makeDateArrayFromStartingMonth(fullYear, month);
  const transform = transformDateWithValidation(
    transformDate,
    (date) => date.getMonth() === month
  );
  return dateArray(transform);
}

type DatesWithValidationFunc = {
  (fullYear: number, month: number): DateWithValidation[];
};

function makeDatesAfterMonth(
  getDates: DatesWithValidationFunc,
  numOfMonth: number
) {
  return (fullYear: number, month: number) => {
    const date = new Date(fullYear, month);
    date.setMonth(date.getMonth() + numOfMonth);
    return getDates(date.getFullYear(), date.getMonth());
  };
}

// test
function testTime() {
  const date = new Date();
  const fullYear = date.getFullYear();
  const month = date.getMonth();
  const dateArray = getDatesWithCurrentMonth(fullYear, month);
  const dateArrayAfterTwoMonth = makeDatesAfterMonth(
    getDatesWithCurrentMonth,
    2
  )(fullYear, month);
  console.log("currentMonth:", dateArray);
  console.log("twoMonthAfter:", dateArrayAfterTwoMonth);
}

// testTime();
