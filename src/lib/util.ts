// 함수 파이프 라인으로 연결하고 에러 처리하기
export function pipe(...fns: any[]) {
  return (x: any) => {
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
