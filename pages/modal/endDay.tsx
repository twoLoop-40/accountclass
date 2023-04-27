import Modal from "../../components/modal";
import { getDatesWithCurrentMonth } from "../../src/lib/makeDateArray";
import { useRecoilState, waitForAll } from "recoil";
import { endDayState } from "../../src/recoil/atoms";
import { addLocalStorage } from "../../src/lib/util";

export default function CalendarEnd() {
  const date = new Date();
  const fullYear = date.getFullYear();
  const month = date.getMonth();
  const days = getDatesWithCurrentMonth(fullYear, month);
  let [endDay, setEndDay] = useRecoilState(endDayState);
  setEndDay = addLocalStorage("endDayStorage", setEndDay);
  return <Modal {...{ fullYear, days, month, endDay, setEndDay }} />;
}
