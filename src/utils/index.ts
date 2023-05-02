const timeFormat = (deadline: string) => {
  const curDate = new Date();
  const dueDate = new Date(deadline);
  const timeDiff = curDate.getTime() - dueDate.getTime();
  const day = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60 * 24) + 1);

  return timeDiff > 0 ? '제출마감' : `D-${day}`;
};

const generateNewElement = (data: string) => {
  const element = document.createElement('div');
  element.innerHTML = data;
  return element;
};

const getLinkId = (link: string) => {
  const queryString = link.substring(link.indexOf('?') + 1);
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('id');
};

export { timeFormat, generateNewElement, getLinkId };
