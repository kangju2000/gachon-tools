function allProgress<T>(proms: Promise<T>[], progress_cb: (progress: number) => void) {
  let d = 0;
  progress_cb(0);
  for (const p of proms) {
    p.then(() => {
      d++;
      progress_cb((d * 100) / proms.length);
    });
  }
  return Promise.all(proms);
}

function timeFormat(endAt: string) {
  const curDate = new Date();
  const dueDate = new Date(endAt);
  const timeDiff = dueDate.getTime() - curDate.getTime();
  const day = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60 * 24));
  if (timeDiff > 0 && day === 0) return 'D-day';
  return timeDiff < 0 ? '제출마감' : `D-${day}`;
}

function convertDateTime(dateTime: string) {
  const [, month, day, hour, minute] = dateTime.split(/\-|:| /);
  const date = new Date(dateTime);
  const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

  return `${month}월 ${day}일 (${dayName}) ${hour}시 ${minute}분`;
}

function generateNewElement(data: string) {
  const element = document.createElement('div');
  element.innerHTML = data;
  return element;
}

function getLinkId(link: string) {
  return new URL(link).searchParams.get('id');
}

function pipe<T>(value: T, ...funcs: ((value: T) => T)[]) {
  let acc = value;
  for (const f of funcs) {
    acc = f(acc);
  }
  return acc;
}

export { allProgress, timeFormat, convertDateTime, generateNewElement, getLinkId, pipe };
