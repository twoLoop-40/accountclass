import Modal from "../../components/modal";
import { getDatesWithCurrentMonth } from "../../src/lib/makeDateArray";
import { useRecoilState } from "recoil";
import { startDayState } from "../../src/recoil/atoms";

export default function CalendarStart() {
  const date = new Date();
  const fullYear = date.getFullYear();
  const month = date.getMonth();
  const days = getDatesWithCurrentMonth(fullYear, month);
  const [startDay, setStartDay] = useRecoilState(startDayState);
  return <Modal {...{ fullYear, days, month, startDay, setStartDay }} />;
}
