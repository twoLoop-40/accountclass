import { DefaultValue, atom, selector } from "recoil";
type EffectModifier<T> = {
  setSelf: (newValue: T) => void;
  onSet: (
    handler: (newValue: T, oldValue: T | DefaultValue, isReset: boolean) => void
  ) => void;
};

function localStorageEffect(key: string) {
  let savedValue: string | null;
  if (typeof window !== "undefined") {
    savedValue = localStorage.getItem(key);
  }
  return <T>({ setSelf, onSet }: EffectModifier<T>) => {
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
  effects: [localStorageEffect("startDayStorage")],
});

export const endDayState = atom<string>({
  key: "endDayState",
  default: "",
  effects: [localStorageEffect("endDayStorage")],
});
