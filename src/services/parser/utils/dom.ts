import * as cheerio from 'cheerio'

import type { UniversityLink } from '@/constants/univ'
import { UNIVERSITY_LINK_LIST } from '@/constants/univ'

const origin = (typeof window !== 'undefined' ? window.location.origin : UNIVERSITY_LINK_LIST[0]) as UniversityLink

export async function fetchAndParse(url: string): Promise<cheerio.CheerioAPI> {
  try {
    const response = await fetch(origin + url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const html = await response.text()
    const $ = cheerio.load(html)
    $('script, style').remove()
    return $
  } catch (error) {
    console.error(`Error fetching/parsing document from ${url}:`, error)
    throw error
  }
}
