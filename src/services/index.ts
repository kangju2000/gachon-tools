import * as cheerio from 'cheerio'

import type { ActivityType, Assignment, Course, Video } from '@/types'
import { getLinkId } from '@/utils'
import { mapElement } from '@/utils/mapElement'

const fetchDocument = async (url: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(response.statusText)

    const html = await response.text()
    const $ = cheerio.load(html)
    return $
  } catch (error) {
    console.error(error)
  }
}

/**
 * 모든 course를 가져온다.
 */
export const getCourses = async (): Promise<Course[]> => {
  const $ = await fetchDocument('https://cyber.gachon.ac.kr/local/ubion/user')

  const courses = mapElement($('.coursefullname'), (i, el) => {
    const id = getLinkId($(el).attr('href'))
    const title = $(el)
      .text()
      .replace(/ \((\d{5}_\d{3})\)/, '')

    return { id, title }
  })

  return courses
}

/**
 * 강의의 activity들을 가져온다.
 * @param courseId course id
 */
export const getActivities = async (
  courseTitle: string,
  courseId: string,
  assignmentSubmittedArray: Awaited<ReturnType<typeof getAssignmentSubmitted>>,
  videoSubmittedArray: Awaited<ReturnType<typeof getVideoSubmitted>>,
): Promise<ActivityType[]> => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/course/view.php?id=${courseId}`)

  const assignment: Assignment[] = getAssignmentAtCourseDocument($, courseId).reduce((acc, cur) => {
    const findAssignment = assignmentSubmittedArray.find(a => a.id === cur.id)
    if (findAssignment) return [...acc, Object.assign({}, cur, findAssignment, { courseTitle })]

    return acc
  }, [])

  const video: Video[] = getVideoAtCourseDocument($, courseId).reduce((acc, cur) => {
    const findVideo = videoSubmittedArray.find(v => v.sectionTitle === cur.sectionTitle && v.title === cur.title)
    if (findVideo) return [...acc, Object.assign({}, cur, findVideo, { courseTitle })]

    return acc
  }, [])

  return [...assignment, ...video]
}

/**
 * 강의 페이지의 document에서 과제를 가져온다.
 * @param $
 * @param courseId
 */
const getAssignmentAtCourseDocument = (
  $: cheerio.CheerioAPI,
  courseId: string,
): Omit<Assignment, 'courseTitle' | 'hasSubmitted'>[] => {
  const sectionOne = mapElement($('#section-0 .modtype_assign .activityinstance'), (i, el) => {
    const link = $(el).find('a').attr('href')
    const id = getLinkId(link)
    const title = $(el).find('.instancename').clone().children().remove().end().text().trim()
    const assignment = { type: 'assignment' as const, id, courseId, title, startAt: '', endAt: '' }

    return assignment
  })

  const sectionTwo = mapElement($('.total_sections .content'), (i, el) => {
    const sectionTitle = $(el).find('.sectionname').text().trim()

    const assignment = mapElement($(el).find('.modtype_assign .activityinstance'), (i, el) => {
      const link = $(el).find('a').attr('href') // 링크 없는 과제도 존재
      const id = getLinkId(link)
      const title = $(el).find('.instancename').clone().children().remove().end().text().trim()
      const [startAt, endAt] = $(el)
        .find('.displayoptions')
        .text()
        .split(' ~ ')
        .map(t => t.trim())

      return { type: 'assignment' as const, id, courseId, title, sectionTitle, startAt, endAt }
    })

    return assignment
  })

  return [...sectionOne, ...sectionTwo]
}

/**
 * 강의 페이지의 document에서 동영상 과제를 가져온다.
 * @param $
 * @param courseId
 */
const getVideoAtCourseDocument = (
  $: cheerio.CheerioAPI,
  courseId: string,
): Omit<Video, 'courseTitle' | 'hasSubmitted'>[] => {
  return mapElement($('.total_sections .content'), (i, el) => {
    const sectionTitle = $(el).find('.sectionname').text().trim().split(' ')[0].match(/\d+/g)?.[0]

    const video = mapElement($(el).find('.modtype_vod .activityinstance'), (i, el) => {
      const link = $(el).find('a').attr('href') // 링크 없는 과제도 존재
      const id = getLinkId(link)
      const title = $(el).find('.instancename').clone().children().remove().end().text().trim()
      const [startAt, endAt] = $(el)
        .find('.displayoptions .text-ubstrap')
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .split(' ~ ')
        .map(t => t.trim())

      return { type: 'video' as const, id, courseId, title, startAt, endAt, sectionTitle }
    })

    return video
  })
}

/**
 * 강의의 과제 제출 여부를 가져온다.
 * @param courseId course id
 */
export const getAssignmentSubmitted = async (
  courseId: string,
): Promise<Pick<Assignment, 'id' | 'title' | 'hasSubmitted' | 'endAt'>[]> => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/mod/assign/index.php?id=${courseId}`)

  return mapElement($('tbody tr'), (i, el) => {
    if ($(el).find('.tabledivider').length) return
    const id = getLinkId($(el).find('.c1 a').attr('href'))

    const title = $(el).find('.c1 a').text().trim()
    const endAt = $(el).find('.c2').text().trim() + ':00'
    const hasSubmitted = /(Submitted for grading)|(제출 완료)/.test($(el).find('.c3').text())

    return { id, title, endAt, hasSubmitted }
  })
}

/**
 * 강의의 비디오 제출 여부를 가져온다.
 * @param courseId course id
 */
export const getVideoSubmitted = async (
  courseId: string,
): Promise<Pick<Video, 'title' | 'hasSubmitted' | 'sectionTitle'>[]> => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/report/ubcompletion/progress.php?id=${courseId}`)

  const className =
    $('.user_progress tbody tr').length === 0 ? '.user_progress_table tbody tr' : '.user_progress tbody tr'

  let section = '1'
  return mapElement($(className), (_, el) => {
    if ($(el.firstChild).attr('rowspan') || $(el.firstChild).hasClass('vmiddle')) {
      section = $(el.firstChild).text().trim()
    }

    const std = $(el).find('.text-center.hidden-xs.hidden-sm')
    const title = std.prev().text().trim()
    const sectionTitle = section
    const requiredTime = std.text().trim()
    const totalStudyTime = std.next().clone().children().remove().end().text().trim()
    const hasSubmitted = Number(requiredTime.replace(/:/g, '')) <= Number(totalStudyTime.replace(/:/g, ''))

    return { title, hasSubmitted, sectionTitle }
  })
}
