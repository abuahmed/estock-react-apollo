import { isLeapYear, addYears, getDayOfYear, getYear } from "date-fns";
export const getAmharicCalendar = (
  gregory: Date,
  longFormat: boolean
): string => {
  const gregoryDate = gregory.toString();

  var nextIsLeapYear = isLeapYear(addYears(Date.parse(gregoryDate), 1));

  let lastDate = new Date(getYear(Date.parse(gregoryDate)), 8, 10);

  if (nextIsLeapYear)
    lastDate = new Date(getYear(Date.parse(gregoryDate)), 8, 11); //will be 11 if the next year is a leap year

  var difference = getDayOfYear(lastDate);
  var dayValue = 0,
    monthValue = 0,
    yearValue = 2000;
  if (getDayOfYear(Date.parse(gregoryDate)) > difference) {
    //is in between meskerem 1 and tahasas 22
    difference = getDayOfYear(Date.parse(gregoryDate)) - difference;

    dayValue = difference % 30;
    monthValue = difference / 30;
    yearValue = getYear(Date.parse(gregoryDate)) - 7;
  } //is in between tahasas 22 and meskerem 1
  else {
    var yearLength = 365;
    if (nextIsLeapYear) yearLength = 366;
    difference =
      getDayOfYear(Date.parse(gregoryDate)) + (yearLength - difference); //will be 366 if the next year is a leap year

    dayValue = difference % 30;
    monthValue = difference / 30;
    yearValue = getYear(Date.parse(gregoryDate)) - 8;
  }

  monthValue = Math.floor(monthValue);
  if (dayValue === 0) {
    monthValue = monthValue - 1;
    dayValue = 30;
  }
  var days = dayValue.toString();
  var months = (monthValue + 1).toString();
  if (dayValue < 10) days = "0" + dayValue;
  if (monthValue + 1 < 10) months = "0" + (monthValue + 1).toString();

  if (longFormat)
    return (
      getAmharicMonth(monthValue) + " " + days + " " + yearValue.toString()
    );
  else return days + "" + months + "" + yearValue.toString();
};
export const getAmharicCalendarFormatted = (
  gregoryDate: Date,
  separator: string
): string => {
  let amhCalender = getAmharicCalendar(gregoryDate, false);
  return (
    amhCalender.substr(0, 2) +
    separator +
    amhCalender.substr(2, 2) +
    separator +
    amhCalender.substr(4)
  );
};
//   export const getGregoryCalendar=(amharicYear:number, amharicMonth:number, amharicDay:number):Date=>
//   {
//       let yearr = amharicYear;
//       var beginDate = new Date(yearr, 9, 11);
//       let noOfDays = (amharicMonth - 1) * 30 + amharicDay;

//       if (noOfDays <= 112)
//       {
//           beginDate = Date.IsLeapYear(yearr + 8) ? new Date(yearr + 7, 9, 11) : new Date(yearr + 7, 9, 10);
//       }
//       else
//       {
//           beginDate = Date.IsLeapYear(yearr + 7) ? new Date(yearr + 7, 9, 11) : new Date(yearr + 7, 9, 10);
//       }

//       return beginDate.AddDays(noOfDays);

//   }
export const getAmharicMonth = (month: number): string => {
  const amharicMonths: string[] = [
    "መስከረም",
    "ጥቅምት",
    "ሕዳር",
    "ታህሳስ",
    "ጥር",
    "የካቲት",
    "መጋቢት",
    "ሚያዚያ",
    "ግንቦት",
    "ሰኔ",
    "ሐምሌ",
    "ነሃሴ",
    "ጳጉሜ",
  ];
  return amharicMonths[month];
};
export const getGregoryMonth = (month: number): string => {
  const gregoryMonths: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return gregoryMonths[month];
};
