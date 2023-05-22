export default function timeFormat(endAt: string) {
  if (!endAt) return '';

  const curDate = new Date();
  const dueDate = new Date(endAt);
  const timeDiff = dueDate.getTime() - curDate.getTime();
  const day = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60 * 24));
  if ((timeDiff > 0 && day === 0) || timeDiff === 0) return 'D-day';
  return timeDiff < 0 ? '제출마감' : `D-${day}`;
}
