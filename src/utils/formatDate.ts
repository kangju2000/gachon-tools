import { format, formatDistanceToNowStrict } from 'date-fns'

const foramtDate = (locale: Locale, date: string) => {
  const d = new Date(date)
  const now = Date.now()
  const diff = (now - d.getTime()) / 1000

  if (diff < 60 * 1) {
    return locale.code === 'ko' ? '방금 전' : 'just now'
  }
  if (diff < 60 * 60 * 24 * 3) {
    return formatDistanceToNowStrict(d, { addSuffix: true, locale })
  }
  return format(d, locale.code === 'ko' ? 'yyyy년 MM월 dd일' : 'dd MMM yyyy')
}

export default foramtDate
