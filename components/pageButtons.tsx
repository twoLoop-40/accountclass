import { activePageClassName } from "../src/lib/util";

interface PageButtonsProps {
  buttonNumber: number;
  onCurrentPageClick: (page: number) => void;
  currentPage: number;
}
function PageButtons({
  buttonNumber,
  onCurrentPageClick,
  currentPage,
}: PageButtonsProps) {
  const buttonNumsArr = Array.from({ length: buttonNumber }, (_, i) => i + 1);
  return (
    <>
      {buttonNumsArr.map((pageIdx: number) => (
        <button
          className={activePageClassName(pageIdx === currentPage)}
          key={pageIdx}
          onClick={() => onCurrentPageClick(pageIdx)}
        >
          {pageIdx}
        </button>
      ))}
    </>
  );
}

export default PageButtons;
