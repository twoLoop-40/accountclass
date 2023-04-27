import Modal from "../../components/modal";
import { getDatesWithCurrentMonth } from "../../src/lib/makeDateArray";
import { useRecoilState } from "recoil";
import { startDayState } from "../../src/recoil/atoms";
import { addLocalStorage } from "../../src/lib/util";

export default function CalendarStart() {
  const date = new Date();
  const fullYear = date.getFullYear();
  const month = date.getMonth();
  const days = getDatesWithCurrentMonth(fullYear, month);
  let [startDay, setStartDay] = useRecoilState(startDayState);
  setStartDay = addLocalStorage("startDayStorage", setStartDay);
  return <Modal {...{ fullYear, days, month, startDay, setStartDay }} />;
}
