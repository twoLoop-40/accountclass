"use strict";
exports.__esModule = true;
exports.getDatesWithCurrentMonth = void 0;
// 함수 파이프 라인으로 연결하고 에러 처리하기
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (x) {
        try {
            return fns.reduce(function (v, f) { return f(v); }, x);
        }
        catch (e) {
            console.error(e);
        }
    };
}
// fullYear, month => firstDay in getTime()
function getFirstDay(_a) {
    var fullYear = _a.fullYear, month = _a.month;
    return new Date(fullYear, month);
}
// date => Sunday
function getStartingDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
}
// 이전달 마지막 일요일 부터 이번달 마지막 일요일까지 날짜 배열
function makeDateArray(_a) {
    var startingDay = _a.startingDay, numOfDates = _a.numOfDates;
    var dateArray = [];
    for (var i = 0; i < numOfDates; i++) {
        dateArray.push(new Date(startingDay.getFullYear(), startingDay.getMonth(), startingDay.getDate() + i));
    }
    return dateArray;
}
// date => makeDateArray
function makeDateArrayFromStartingMonth(fullYear, month) {
    var dateArray = pipe(getFirstDay, function (firstDay) {
        var startingDay = getStartingDay(firstDay);
        var numOfDates = 42;
        return { startingDay: startingDay, numOfDates: numOfDates };
    }, makeDateArray)({ fullYear: fullYear, month: month });
    return function (transformDate) { return dateArray.map(transformDate); };
}
function transformDate(date) {
    return "".concat(date.getFullYear(), "-").concat(date.getMonth() + 1, "-").concat(date.getDate());
}
function transformDateWithValidation(transformDate, isCurrent) {
    return function (dateArg) {
        var date = transformDate(dateArg);
        if (isCurrent(dateArg)) {
            return { date: date, isCurrentMonth: true };
        }
        else {
            return { date: date, isCurrentMonth: false };
        }
    };
}
function getDatesWithCurrentMonth(fullYear, month) {
    var dateArray = makeDateArrayFromStartingMonth(fullYear, month);
    var transform = transformDateWithValidation(transformDate, function (date) { return date.getMonth() === month; });
    return dateArray(transform);
}
exports.getDatesWithCurrentMonth = getDatesWithCurrentMonth;
function makeDatesAfterMonth(getDates, numOfMonth) {
    return function (fullYear, month) {
        var date = new Date(fullYear, month);
        date.setMonth(date.getMonth() + numOfMonth);
        return getDates(date.getFullYear(), date.getMonth());
    };
}
// test
function testTime() {
    var date = new Date();
    var fullYear = date.getFullYear();
    var month = date.getMonth();
    var dateArray = getDatesWithCurrentMonth(fullYear, month);
    var dateArrayAfterTwoMonth = makeDatesAfterMonth(getDatesWithCurrentMonth, 2)(fullYear, month);
    console.log("currentMonth:", dateArray);
    console.log("twoMonthAfter:", dateArrayAfterTwoMonth);
}
testTime();
