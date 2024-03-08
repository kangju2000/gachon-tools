import * as cheerio from 'cheerio'

export function mapElement<T, M>(
  element: cheerio.Cheerio<T>,
  map: (i: number, el: T) => M[] | M | null | undefined,
): M[] {
  return element.map(map).get()
}
