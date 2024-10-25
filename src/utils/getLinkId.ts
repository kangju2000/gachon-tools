export function getLinkId(link?: string) {
  if (link == null) {
    return ''
  }

  try {
    return new URL(link).searchParams.get('id') ?? ''
  } catch {
    return ''
  }
}
