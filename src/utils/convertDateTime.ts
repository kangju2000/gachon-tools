export default function convertDateTime(dateTime: string) {
  if (!dateTime) return '';
  const [, month, day, hour, minute] = dateTime.split(/\-|:| /);
  const date = new Date(dateTime);
  const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

  return `${month}월 ${day}일 (${dayName}) ${hour}시 ${minute}분`;
}
