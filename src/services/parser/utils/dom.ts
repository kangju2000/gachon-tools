import * as cheerio from 'cheerio'

export async function fetchAndParse(url: string): Promise<cheerio.CheerioAPI> {
  try {
    const response = await fetch(document.location.origin + url)
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
