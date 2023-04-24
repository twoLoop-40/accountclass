import Modal from "../../components/modal";
import { getDatesWithCurrentMonth } from "../../lib/makeDateArray";

export default function CalendarStart() {
  const date = new Date();
  const fullYear = date.getFullYear();
  const month = date.getMonth();
  const days = getDatesWithCurrentMonth(fullYear, month);
  return <Modal {...{ fullYear, days, month }} />;
}
