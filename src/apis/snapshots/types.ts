export interface University {
  id: number
  name: string
  domain: string
}

export interface Snapshot {
  id: number
  universityId: number
  url: string
  path: string
  html: string
  courseId?: string
  createdAt: string
}

export interface CreateSnapshotRequest {
  universityId: number
  url: string
  path: string
  html: string
  courseId?: string
}

export interface CreateSnapshotResponse extends Snapshot {}

export interface UniversityListResponse {
  universities: University[]
}

export interface SnapshotListResponse {
  snapshots: Snapshot[]
}
