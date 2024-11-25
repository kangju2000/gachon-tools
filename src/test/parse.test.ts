import * as cheerio from 'cheerio'
import fs from 'fs/promises'
import path from 'path'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'

import type { Snapshot } from '@/apis/snapshots/types'
import {
  parseAssignments,
  parseVideos,
  parseAssignmentSubmitted,
  parseVideoSubmitted,
  getCourses,
} from '@/services/parser'
import { fetchAndParse } from '@/services/parser/utils/dom'

vi.mock('@/services/parser/utils/dom', () => ({
  fetchAndParse: vi.fn(),
}))

describe('Parser Tests', async () => {
  const snapshotPath = path.join(process.cwd(), 'src/__generated__/snapshots/all.json')
  const data = await fs.readFile(snapshotPath, 'utf-8')
  const allSnapshots: Snapshot[] = JSON.parse(data)

  describe('Course List Parsing', async () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should parse course list page', async () => {
      const courseListPath = path.join(__dirname, 'course_list.output.html')
      const data = await fs.readFile(courseListPath, 'utf-8')

      vi.mocked(fetchAndParse).mockImplementation(() => Promise.resolve(cheerio.load(data)))
      const courses = await getCourses()

      expect(courses.length).toBe(8)

      courses.forEach(course => {
        expect(course).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
        })
        expect(course.id).not.toBe('')
      })
    })
  })

  describe('Course Page Parsing', () => {
    const coursePages = allSnapshots.filter(snapshot => snapshot.path.startsWith('/course/view.php'))

    test.each(coursePages)('should parse course page: $path', snapshot => {
      const $ = cheerio.load(snapshot.html)

      const courseId = snapshot.courseId

      if (courseId == null) {
        return
      }

      // 과제 파싱 테스트
      const assignments = parseAssignments($, courseId)
      expect(assignments).toBeDefined()
      assignments.forEach(assignment => {
        expect(assignment).toMatchObject({
          type: 'assignment',
          id: expect.any(String),
          courseId,
          title: expect.any(String),
          startAt: expect.any(String),
          ...(assignment.endAt != null && { endAt: expect.any(String) }),
        })
      })

      // 비디오 파싱 테스트
      const videos = parseVideos($, courseId)
      expect(videos).toBeDefined()
      videos.forEach(video => {
        expect(video).toMatchObject({
          type: 'video',
          id: expect.any(String),
          courseId,
          title: expect.any(String),
          startAt: expect.any(String),
          endAt: expect.any(String),
          sectionTitle: expect.any(String),
        })
      })
    })
  })

  describe('Assignment Submission Page Parsing', () => {
    const assignmentPages = allSnapshots.filter(snapshot => snapshot.path.startsWith('/mod/assign/index.php'))

    test.each(assignmentPages)('should parse assignment submission page: $path', async snapshot => {
      const $ = cheerio.load(snapshot.html)
      const submissions = parseAssignmentSubmitted($)

      expect(submissions).toBeDefined()
      submissions.forEach(submission => {
        expect(submission).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          endAt: expect.any(String),
          hasSubmitted: expect.any(Boolean),
        })
      })
    })
  })

  describe('Video Progress Page Parsing', () => {
    const videoProgressPages = allSnapshots.filter(snapshot =>
      snapshot.path.startsWith('/report/ubcompletion/user_progress.php'),
    )

    test.each(videoProgressPages)('should parse video progress page: $path', async snapshot => {
      const $ = cheerio.load(snapshot.html)
      const submissions = parseVideoSubmitted($)

      expect(submissions).toBeDefined()
      submissions.forEach(submission => {
        expect(submission).toMatchObject({
          title: expect.any(String),
          hasSubmitted: expect.any(Boolean),
          sectionTitle: expect.any(String),
        })
      })
    })
  })

  describe('Data Consistency', () => {
    test('should maintain consistent course IDs across pages', () => {
      const courseIds = new Set(allSnapshots.map(s => s.courseId).filter(Boolean))
      courseIds.forEach(courseId => {
        const coursePages = allSnapshots.filter(s => s.courseId === courseId)
        expect(coursePages.length).toBeGreaterThan(0)
      })
    })

    test('should have matching assignment IDs between course and submission pages', async () => {
      for (const courseId of new Set(allSnapshots.map(s => s.courseId).filter(Boolean))) {
        if (courseId == null) {
          continue
        }

        const coursePage = allSnapshots.find(s => s.courseId === courseId && s.path.startsWith('/course/view.php'))
        const submissionPage = allSnapshots.find(
          s => s.courseId === courseId && s.path.startsWith('/mod/assign/index.php'),
        )

        if (coursePage && submissionPage) {
          const $course = cheerio.load(coursePage.html)
          const $submission = cheerio.load(submissionPage.html)

          const assignments = parseAssignments($course, courseId)
          const submissions = parseAssignmentSubmitted($submission)

          // 과제 ID가 양쪽 페이지에서 일치하는지 확인
          assignments.forEach(assignment => {
            const matchingSubmission = submissions.find(s => s.id === assignment.id)
            expect(matchingSubmission).toBeDefined()
          })
        }
      }
    })
  })

  describe('Assignment Parsing', () => {
    test('should parse assignments using DOM selectors', () => {
      const html = `
        <div id="section-0">
          <div class="content">
            <ul class="section img-text">
              <li class="activity assign modtype_assign">
                <div class="activityinstance">
                  <a href="https://cyber.gachon.ac.kr/mod/assign/view.php?id=12345">
                    <img
                      src="https://cyber.gachon.ac.kr/theme/image.php/coursemosv2/assign/1731574130/icon"
                      alt="과제"
                      class="activityicon"
                    />
                    <span class="instancename">과제 1<span class="accesshide"> 과제</span></span>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="total_sections">
          <div class="content">
            <h3 class="sectionname">2주차</h3>
            <ul class="section img-text">
              <li class="activity assign modtype_assign">
                <div class="activityinstance">
                  <a href="https://cyber.gachon.ac.kr/mod/assign/view.php?id=12346">
                    <img
                      src="https://cyber.gachon.ac.kr/theme/image.php/coursemosv2/assign/1731574130/icon"
                      alt="과제"
                      class="activityicon"
                    />
                    <span class="instancename">과제 2<span class="accesshide"> 과제</span></span>
                  </a>
                  <span class="displayoptions">2024-05-22 00:00:00 ~ 2024-05-29 00:00:00</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      `
      const $ = cheerio.load(html)
      const assignments = parseAssignments($, '')

      expect(assignments).toHaveLength(2)
      expect(assignments[0]).toMatchObject({
        id: '12345',
        title: '과제 1',
      })
      expect(assignments[1]).toMatchObject({
        id: '12346',
        title: '과제 2',
        sectionTitle: '2주차',
      })
    })
  })

  describe('Video Parsing', () => {
    test('should parse videos using DOM selectors', () => {
      const html = `
        <div class="total_sections">
          <div class="content">
            <h3 class="sectionname">3주차</h3>
            <li class="modtype_vod">
              <div class="activityinstance">
                <a href="https://cyber.gachon.ac.kr/mod/vod/view.php?id=12347">
                  <span class="instancename">강의 1</span>
              </a>
              <div class="displayoptions">
                <span class="text-ubstrap">2024-03-21 ~ 2024-03-28</span>
                </div>
              </div>
            </li>
          </div>
        </div>
      `
      const $ = cheerio.load(html)
      const videos = parseVideos($, '93771')

      expect(videos).toHaveLength(1)
      expect(videos[0]).toMatchObject({
        id: '12347',
        title: '강의 1',
        sectionTitle: '3주차',
        startAt: '2024-03-21',
        endAt: '2024-03-28',
      })
    })
  })
})
