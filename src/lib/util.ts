import axios from "axios";

// 함수 파이프 라인으로 연결하고 에러 처리하기
export function pipe<T, U>(...fns: any[]): (arg: T) => U {
  return (x: T) => {
    try {
      return fns.reduce((v, f) => f(v), x);
    } catch (e) {
      console.error(e);
    }
  };
}

export function parallel<T, U>(...fns: ((arg: T) => U)[]) {
  if (fns.length === 0) {
    return null;
  }
  return <R>(arg: T) => {
    try {
      const jobs = fns.map((fn) => fn(arg));
      return (finalWork: (argResult: U[]) => R) => finalWork(jobs);
    } catch (err) {
      console.error("Error Occured in parallel:", err);
    }
  };
}

// fetchdata axios로 데이터 불러오는 함수
export async function fetchData<T, U>(
  url: string,
  params?: T
): Promise<U | undefined> {
  try {
    const response = await axios.get(url, { params: { ...params } });
    return response.data as U;
  } catch (err) {
    console.error(err);
  }
}

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function addLocalStorage<T>(key: string, proc: (arg: T) => void) {
  return (arg: T) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      const savedValue = JSON.parse(saved);
      saved !== arg ? localStorage.setItem(key, JSON.stringify(arg)) : null;
    }
    localStorage.setItem(key, JSON.stringify(arg));
    return proc(arg);
  };
}

export function activePageClassName(active: boolean): string {
  return active
    ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    : "relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex";
}
