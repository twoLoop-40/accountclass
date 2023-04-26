import Modal from "../../components/modal";
import { getDatesWithCurrentMonth } from "../../src/lib/makeDateArray";
import { useRecoilState, waitForAll } from "recoil";
import { endDayState } from "../../src/recoil/atoms";

export default function CalendarEnd() {
  const date = new Date();
  const fullYear = date.getFullYear();
  const month = date.getMonth();
  const days = getDatesWithCurrentMonth(fullYear, month);
  const [endDay, setEndDay] = useRecoilState(endDayState);
  return <Modal {...{ fullYear, days, month, endDay, setEndDay }} />;
}
