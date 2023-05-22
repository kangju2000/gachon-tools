export default function getLinkId(link: string) {
  if (!link) return '';
  return new URL(link).searchParams.get('id');
}
