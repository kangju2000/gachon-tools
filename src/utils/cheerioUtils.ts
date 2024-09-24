import type { Cheerio } from 'cheerio'
import type { AnyNode } from 'domhandler'

export const mapElement = <T>(elements: Cheerio<AnyNode>, callback: (i: number, el: AnyNode) => T | undefined): T[] => {
  return elements
    .map((i, el) => callback(i, el))
    .get()
    .filter((item): item is T => item !== undefined)
}

export const getText = ($el: Cheerio<AnyNode>): string => $el.text().trim()
export const getAttr = ($el: Cheerio<AnyNode>, attr: string): string => $el.attr(attr) || ''
