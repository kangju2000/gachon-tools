function timeFormat(endAt: Date) {
  const curDate = new Date();
  const dueDate = endAt;
  const timeDiff = dueDate.getTime() - curDate.getTime();
  const day = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60 * 24));
  if (timeDiff > 0 && day === 0) return 'D-day';
  return timeDiff < 0 ? '제출마감' : `D-${day}`;
}

function generateNewElement(data: string) {
  const element = document.createElement('div');
  element.innerHTML = data;
  return element;
}

function getLinkId(link: string) {
  const queryString = link.substring(link.indexOf('?') + 1);
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('id');
}

function pipe<T>(value: T, ...funcs: ((value: T) => T)[]) {
  let acc = value;
  for (const f of funcs) {
    acc = f(acc);
  }
  return acc;
}

export { timeFormat, generateNewElement, getLinkId, pipe };
