import * as cheerio from 'cheerio'

import { DOM_SELECTORS } from './constants/selectors'
import { UNIVERSITY_REGEX, SUBMISSION_STATUS_REGEX } from './constants/universities'
import { URL_PATTERNS } from './constants/urls'
import { UNIVERITY_NAME_MAP } from '@/constants/univ'
import type { UniversityLink } from '@/constants/univ'
import type { Activity, Assignment, Course, Video } from '@/types'
import { getLinkId, mapElement, getAttr, getText } from '@/utils'

import type { AnyNode } from 'domhandler'

const origin = window.location.origin as UniversityLink
const university = UNIVERITY_NAME_MAP[origin]

/**
 * HTML을 가져와서 파싱하는 함수
 */
async function fetchHTML(url: string): Promise<cheerio.CheerioAPI> {
  try {
    const response = await fetch(origin + url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const html = await response.text()
    const $ = cheerio.load(html)
    $('script, style').remove()

    return $
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ${url}: ${error.message}`)
    }
    throw error
  }
}

export async function getCourses(params?: { year: number; semester: number }): Promise<Course[]> {
  let $: cheerio.CheerioAPI
  if (params) {
    const { year, semester } = params
    $ = await fetchHTML(URL_PATTERNS.coursesWithYearSemester(year, semester))
  } else {
    $ = await fetchHTML(URL_PATTERNS.courses)
  }

  return mapElement($(DOM_SELECTORS.courses.container), (_, el) => {
    const $el = $(el)
    return {
      id: getLinkId(getAttr($el, DOM_SELECTORS.courses.link)),
      title: getText($el).replace(UNIVERSITY_REGEX[university]?.titleRegex, ''),
    }
  })
}

export function parseAssignments(
  $: cheerio.CheerioAPI,
  courseId: string,
): Array<Omit<Assignment, 'courseTitle' | 'hasSubmitted'>> {
  const { sections, assignment } = DOM_SELECTORS.activities

  const parseAssignment = ($el: cheerio.Cheerio<AnyNode>, sectionTitle?: string) => {
    const link = getAttr($el.find(assignment.link), 'href')
    const id = getLinkId(link)
    const title = getText($el.find(assignment.title).clone().children().remove().end())
    const [startAt, endAt] = getText($el.find(assignment.period))
      .split(' ~ ')
      .map(t => t.trim())
    return { type: 'assignment' as const, id, courseId, title, sectionTitle, startAt, endAt }
  }

  const sectionOne = mapElement($(`${sections.first} ${assignment.container}`), (_, el) => parseAssignment($(el)))

  const sectionTwo = mapElement($(sections.all), (_, content) => {
    const $content = $(content)
    const sectionTitle = getText($content.find(sections.title))

    return mapElement($content.find(assignment.container), (_, el) => parseAssignment($(el), sectionTitle))
  }).flat()

  return [...sectionOne, ...sectionTwo]
}

export function parseVideos(
  $: cheerio.CheerioAPI,
  courseId: string,
): Array<Omit<Video, 'courseTitle' | 'hasSubmitted'>> {
  const { sections, video } = DOM_SELECTORS.activities

  return mapElement($(sections.all), (_, content) => {
    const $content = $(content)
    const sectionTitle = getText($content.find(sections.title))

    return mapElement($content.find(video.container), (_, el) => {
      const $el = $(el)
      const link = getAttr($el.find(video.link), 'href')
      const id = getLinkId(link)
      const title = getText($el.find(video.title).clone().children().remove().end())
      const [startAt, endAt] = getText($el.find(video.period).clone().children().remove().end())
        .split(' ~ ')
        .map(t => t.trim())

      return { type: 'video' as const, id, courseId, title, startAt, endAt, sectionTitle }
    })
  }).flat()
}

export function parseAssignmentSubmitted(
  $: cheerio.CheerioAPI,
): Array<Pick<Assignment, 'id' | 'title' | 'hasSubmitted' | 'endAt'>> {
  const { container, divider, title, period, status } = DOM_SELECTORS.submissions.assignment

  return mapElement($(container), (_, el) => {
    const $el = $(el)
    if ($el.find(divider).length) return

    const id = getLinkId(getAttr($el.find(title), 'href'))
    const assignmentTitle = getText($el.find(title))
    const endAt = getText($el.find(period)) + ':00'
    const hasSubmitted = SUBMISSION_STATUS_REGEX.test(getText($el.find(status)))

    return { id, title: assignmentTitle, endAt, hasSubmitted }
  })
}

export function parseVideoSubmitted(
  $: cheerio.CheerioAPI,
): Array<Pick<Video, 'title' | 'hasSubmitted' | 'sectionTitle'>> {
  const { container, title, sectionTitle, requiredTime } = DOM_SELECTORS.submissions.video

  let currentSectionTitle = ''
  return mapElement($(container), (_, el) => {
    const $el = $(el)
    const $sectionTitle = $el.find(sectionTitle)
    const originalTitle = $sectionTitle.attr('title')

    if (originalTitle != null && originalTitle !== '') {
      currentSectionTitle = originalTitle
    }

    const videoTitle = getText($el.find(title))
    const $std = $el.find(requiredTime)
    const required = getText($std) // mm:ss
    const total = getText($std.next().clone().children().remove().end()) // mm:ss
    const hasSubmitted = Number(required.replace(/:/g, '')) <= Number(total.replace(/:/g, ''))

    return { title: videoTitle, hasSubmitted, sectionTitle: currentSectionTitle }
  })
}

export async function getAssignmentSubmitted(
  courseId: string,
): Promise<Array<Pick<Assignment, 'id' | 'title' | 'hasSubmitted' | 'endAt'>>> {
  const $ = await fetchHTML(URL_PATTERNS.assignmentSubmitted(courseId))
  return parseAssignmentSubmitted($)
}

export async function getVideoSubmitted(
  courseId: string,
): Promise<Array<Pick<Video, 'title' | 'hasSubmitted' | 'sectionTitle'>>> {
  const $ = await fetchHTML(URL_PATTERNS.videoSubmitted(courseId))
  return parseVideoSubmitted($)
}

export async function getActivities(
  courseTitle: string,
  courseId: string,
  assignmentSubmittedArray: Awaited<ReturnType<typeof getAssignmentSubmitted>>,
  videoSubmittedArray: Awaited<ReturnType<typeof getVideoSubmitted>>,
): Promise<Activity[]> {
  const $ = await fetchHTML(URL_PATTERNS.activities(courseId))

  const assignments = parseAssignments($, courseId).reduce<Assignment[]>((acc, cur) => {
    const findAssignment = assignmentSubmittedArray.find(a => a.id === cur.id)
    return findAssignment ? [...acc, { ...cur, ...findAssignment, courseTitle }] : acc
  }, [])

  const videos = parseVideos($, courseId).reduce<Video[]>((acc, cur) => {
    const findVideo = videoSubmittedArray.find(v => v.sectionTitle === cur.sectionTitle && v.title === cur.title)
    return findVideo ? [...acc, { ...cur, ...findVideo, courseTitle }] : acc
  }, [])

  return [...assignments, ...videos]
}
