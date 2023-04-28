import { DefaultValue, atom, selector } from "recoil";
import { StudentLectureCount } from "../../components/studentList";
type EffectModifier<T> = {
  setSelf: (newValue: T) => void;
  onSet: (
    handler: (newValue: T, oldValue: T | DefaultValue, isReset: boolean) => void
  ) => void;
};

function localStorageEffect<T>(key: string) {
  let savedValue: string | null;
  if (typeof window !== "undefined") {
    savedValue = localStorage.getItem(key);
  }
  return ({ setSelf, onSet }: EffectModifier<T>) => {
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue: T, oldValue: T | DefaultValue, isReset: boolean) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
}

export const startDayState = atom<string>({
  key: "startDayState",
  default: "",
  // effects: [localStorageEffect("startDayStateStorage")],
});

export const endDayState = atom<string>({
  key: "endDayState",
  default: "",
  // effects: [localStorageEffect("endDayStateStorage")],
});

type Lecture = {
  id: number;
  lectureName: string;
};

const lectureNameInit: Lecture[] = [
  { id: 0, lectureName: "수업을 선택하세요" },
];

export const lectureNameState = atom<Lecture>({
  key: "lectureState",
  default: lectureNameInit[0],
});

export const studentAttendanceCountState = atom<StudentLectureCount[]>({
  key: "studentAttendanceCountState",
  default: [],
});

export const loadingState = atom<boolean>({
  key: "loadingState",
  default: false,
});
