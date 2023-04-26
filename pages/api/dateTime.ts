import {
  getDatesWithCurrentMonth,
  makeDatesAfterMonth,
} from "../../src/lib/makeDateArray";

// test
function testTime() {
  const date = new Date();
  const fullYear = date.getFullYear();
  const month = date.getMonth();
  const dateArray = getDatesWithCurrentMonth(fullYear, month);
  const dateArrayAfterTwoMonth = makeDatesAfterMonth(2)(fullYear, month);
  console.log("currentMonth:", dateArray);
  console.log("twoMonthAfter:", dateArrayAfterTwoMonth);
}

// testTime();
