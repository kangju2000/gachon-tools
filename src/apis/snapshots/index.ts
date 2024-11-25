import { api } from '@/apis/configs/api'
import { getCourses } from '@/services/parser'
import { fetchAndParse } from '@/services/parser/utils/dom'

import type { CreateSnapshotRequest, CreateSnapshotResponse, Snapshot } from './types'

export async function getSnapshots(universityId: number, path?: string, courseId?: string): Promise<Snapshot[]> {
  return await api<Snapshot[]>('/api/snapshots', {
    params: { universityId, path, courseId },
  })
}

export async function postSnapshot(snapshot: CreateSnapshotRequest): Promise<CreateSnapshotResponse> {
  return await api<CreateSnapshotResponse>('/api/snapshots', {
    method: 'POST',
    body: JSON.stringify(snapshot),
  })
}

export async function createSnapshots(): Promise<CreateSnapshotRequest[]> {
  const snapshotRequests: CreateSnapshotRequest[] = []
  let snapshotResponses: CreateSnapshotResponse[] = []

  const urls = {
    activities: (courseId: string) => `/course/view.php?id=${courseId}`,
    assignmentSubmitted: (courseId: string) => `/mod/assign/index.php?id=${courseId}`,
    videoSubmitted: (courseId: string) => `/report/ubcompletion/user_progress.php?id=${courseId}`,
  }

  try {
    const courses = await getCourses()

    for (const course of courses) {
      const activitiesHtml = (await fetchAndParse(urls.activities(course.id))).html()
      snapshotRequests.push({
        courseId: course.id,
        html: activitiesHtml,
        universityId: 1,
        path: urls.activities(course.id),
        url: urls.activities(course.id),
      })

      const assignmentSubmittedHtml = (await fetchAndParse(urls.assignmentSubmitted(course.id))).html()
      snapshotRequests.push({
        courseId: course.id,
        html: assignmentSubmittedHtml,
        universityId: 1,
        path: urls.assignmentSubmitted(course.id),
        url: urls.assignmentSubmitted(course.id),
      })
      const videoSubmittedHtml = (await fetchAndParse(urls.videoSubmitted(course.id))).html()
      snapshotRequests.push({
        courseId: course.id,
        html: videoSubmittedHtml,
        universityId: 1,
        path: urls.videoSubmitted(course.id),
        url: urls.videoSubmitted(course.id),
      })
    }
  } catch (error) {
    console.error('Error fetching courses:', error)
  }

  snapshotResponses = await Promise.all(snapshotRequests.map(snapshot => postSnapshot(snapshot)))

  return snapshotResponses
}
