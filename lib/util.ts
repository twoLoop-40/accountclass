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
