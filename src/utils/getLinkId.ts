export default function getLinkId(link: string) {
  return new URL(link).searchParams.get('id');
}
