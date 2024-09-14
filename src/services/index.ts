import * as cheerio from 'cheerio'

import type { ActivityType, Assignment, Course, Video } from '@/types'
import { getLinkId } from '@/utils'
import { getAttr, getText } from '@/utils/cheerioUtils'
import { mapElement } from '@/utils/mapElement'

import type { AnyNode } from 'domhandler'

type CheerioAPI = cheerio.CheerioAPI

// 네트워크 요청을 담당하는 함수
export async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return await response.text()
}

// HTML 파싱을 담당하는 함수
export function parseHtml(html: string): CheerioAPI {
  const $ = cheerio.load(html)
  $('script, style').remove()
  return $
}

// 문서 가져오기
export async function getDocument(url: string): Promise<CheerioAPI> {
  try {
    const html = await fetchHtml(url)
    const $ = parseHtml(html)
    return $
  } catch (error) {
    console.error(`Error fetching document from ${url}:`, error)
    throw error
  }
}

// 강의 목록 파싱 함수
export function parseCourses($: CheerioAPI): Course[] {
  return mapElement($('.coursefullname'), (_, el) => {
    const $el = $(el)
    const id = getLinkId(getAttr($el, 'href'))
    const title = getText($el).replace(/ \((\d{5}_\d{3})\)/, '')
    return { id, title }
  })
}

// 강의 목록 가져오기
export const getCourses = async (): Promise<Course[]> => {
  const $ = await getDocument('https://cyber.gachon.ac.kr/local/ubion/user')
  return parseCourses($)
}

// 과제 파싱 함수
export function parseAssignments($: CheerioAPI, courseId: string): Omit<Assignment, 'courseTitle' | 'hasSubmitted'>[] {
  const parseAssignment = ($el: cheerio.Cheerio<AnyNode>, sectionTitle?: string) => {
    const link = getAttr($el.find('a'), 'href')
    const id = getLinkId(link)
    const title = getText($el.find('.instancename').clone().children().remove().end())
    const [startAt, endAt] = getText($el.find('.displayoptions'))
      .split(' ~ ')
      .map(t => t.trim())
    return { type: 'assignment' as const, id, courseId, title, sectionTitle, startAt, endAt }
  }

  const sectionOne = mapElement($('#section-0 .modtype_assign .activityinstance'), (_, el) => parseAssignment($(el)))

  const sectionTwo = mapElement($('.total_sections .content'), (_, content) => {
    const $content = $(content)
    const sectionTitle = getText($content.find('.sectionname'))

    return mapElement($content.find('.modtype_assign .activityinstance'), (_, el) => {
      return parseAssignment($(el), sectionTitle)
    })
  }).flat()

  return [...sectionOne, ...sectionTwo]
}

// 비디오 파싱 함수
export function parseVideos($: CheerioAPI, courseId: string): Omit<Video, 'courseTitle' | 'hasSubmitted'>[] {
  return mapElement($('.total_sections .content'), (_, content) => {
    const $content = $(content)
    const sectionTitle = getText($content.find('.sectionname')).split(' ')[0].match(/\d+/g)?.[0]

    return mapElement($content.find('.modtype_vod .activityinstance'), (_, el) => {
      const $el = $(el)
      const link = getAttr($el.find('a'), 'href')
      const id = getLinkId(link)
      const title = getText($el.find('.instancename').clone().children().remove().end())
      const [startAt, endAt] = getText($el.find('.displayoptions .text-ubstrap').clone().children().remove().end())
        .split(' ~ ')
        .map(t => t.trim())
      return { type: 'video' as const, id, courseId, title, startAt, endAt, sectionTitle }
    })
  }).flat()
}

// 활동 가져오기
export const getActivities = async (
  courseTitle: string,
  courseId: string,
  assignmentSubmittedArray: Awaited<ReturnType<typeof getAssignmentSubmitted>>,
  videoSubmittedArray: Awaited<ReturnType<typeof getVideoSubmitted>>,
): Promise<ActivityType[]> => {
  const $ = await getDocument(`https://cyber.gachon.ac.kr/course/view.php?id=${courseId}`)

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

// 과제 제출 여부 파싱 함수
export function parseAssignmentSubmitted($: CheerioAPI): Pick<Assignment, 'id' | 'title' | 'hasSubmitted' | 'endAt'>[] {
  return mapElement($('tbody tr'), (_, el) => {
    const $el = $(el)
    if ($el.find('.tabledivider').length) return

    const id = getLinkId(getAttr($el.find('.c1 a'), 'href'))
    const title = getText($el.find('.c1 a'))
    const endAt = getText($el.find('.c2')) + ':00'
    const hasSubmitted = /(Submitted for grading)|(제출 완료)/.test(getText($el.find('.c3')))

    return { id, title, endAt, hasSubmitted }
  })
}

// 과제 제출 여부 가져오기
export const getAssignmentSubmitted = async (
  courseId: string,
): Promise<Pick<Assignment, 'id' | 'title' | 'hasSubmitted' | 'endAt'>[]> => {
  const $ = await getDocument(`https://cyber.gachon.ac.kr/mod/assign/index.php?id=${courseId}`)
  return parseAssignmentSubmitted($)
}

// 비디오 제출 여부 파싱 함수
export function parseVideoSubmitted($: CheerioAPI): Pick<Video, 'title' | 'hasSubmitted' | 'sectionTitle'>[] {
  const className =
    $('.user_progress tbody tr').length === 0 ? '.user_progress_table tbody tr' : '.user_progress tbody tr'
  const attendanceRule = getText($('.rollbook .blue'))
  const attendanceMark = attendanceRule.match(/\[(.*?)\]/)?.[0]?.replace(/\[|\]/g, '')

  let section = '1'
  return mapElement($(className), (_, el) => {
    const $el = $(el)
    const $firstChild = $el.children().first()

    if ($firstChild.attr('rowspan') || $firstChild.hasClass('vmiddle')) {
      section = getText($firstChild)
    }

    const title = getText($el.find('.text-left'))
    const sectionTitle = section

    if (attendanceMark !== undefined) {
      const attendance = getText($el.find('.text-center').last())
      return { title, hasSubmitted: attendance === attendanceMark, sectionTitle }
    }

    const $std = $el.find('.text-center.hidden-xs.hidden-sm')
    const requiredTime = getText($std)
    const totalStudyTime = getText($std.next().clone().children().remove().end())
    const hasSubmitted = Number(requiredTime.replace(/:/g, '')) <= Number(totalStudyTime.replace(/:/g, ''))

    return { title, hasSubmitted, sectionTitle }
  })
}

// 비디오 제출 여부 가져오기
export const getVideoSubmitted = async (
  courseId: string,
): Promise<Pick<Video, 'title' | 'hasSubmitted' | 'sectionTitle'>[]> => {
  const $ = await getDocument(`https://cyber.gachon.ac.kr/report/ubcompletion/progress.php?id=${courseId}`)
  return parseVideoSubmitted($)
}
