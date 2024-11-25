import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { getSnapshots } from '@/apis/snapshots'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const GENERATED_DIR = path.join(process.cwd(), 'src/__generated__')
const SNAPSHOTS_DIR = path.join(GENERATED_DIR, 'snapshots')

/**
 * 스냅샷을 생성하고 파일로 저장하는 함수
 */
async function generateSnapshots() {
  try {
    // 디렉토리 생성
    await fs.mkdir(GENERATED_DIR, { recursive: true })
    await fs.mkdir(SNAPSHOTS_DIR, { recursive: true })

    // 가천대학교 ID = 1
    const universityId = 1

    // 전체 스냅샷 가져오기
    console.log('📸 Fetching all snapshots...')
    const allSnapshots = await getSnapshots(universityId)

    // 전체 스냅샷 저장
    await fs.writeFile(path.join(SNAPSHOTS_DIR, 'all.json'), JSON.stringify(allSnapshots, null, 2), 'utf-8')
    console.log('✅ Generated all snapshots')

    // 코스별 스냅샷 저장
    const courseIds = [...new Set(allSnapshots.map(s => s.courseId).filter(Boolean))]

    for (const courseId of courseIds) {
      console.log(`📸 Fetching snapshots for course ${courseId}...`)
      const courseSnapshots = await getSnapshots(universityId, undefined, courseId)

      await fs.writeFile(
        path.join(SNAPSHOTS_DIR, `course-${courseId}.json`),
        JSON.stringify(courseSnapshots, null, 2),
        'utf-8',
      )
      console.log(`✅ Generated snapshots for course ${courseId}`)
    }

    // 경로별 스냅샷 저장
    const pathList = [...new Set(allSnapshots.map(s => s.path))]

    for (const pathUrl of pathList) {
      console.log(`📸 Fetching snapshots for path ${pathUrl}...`)
      const pathSnapshots = await getSnapshots(universityId, pathUrl)

      // 파일명에 사용할 수 없는 문자 제거
      const safeFileName = pathUrl.replace(/[<>:"/\\|?*]+/g, '-').replace(/^-+|-+$/g, '')

      await fs.writeFile(
        path.join(SNAPSHOTS_DIR, `path-${safeFileName}.json`),
        JSON.stringify(pathSnapshots, null, 2),
        'utf-8',
      )
      console.log(`✅ Generated snapshots for path ${pathUrl}`)
    }

    // 인덱스 파일 생성
    const index = {
      timestamp: new Date().toISOString(),
      totalSnapshots: allSnapshots.length,
      courses: courseIds,
      paths: pathList,
    }

    await fs.writeFile(path.join(SNAPSHOTS_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf-8')

    console.log('🎉 Successfully generated all snapshots!')
  } catch (error) {
    console.error('❌ Error generating snapshots:', error)
    process.exit(1)
  }
}

// 스크립트 실행
generateSnapshots()
