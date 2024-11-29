export const UNIVERSITY_NAME_MAP = {
  'https://cyber.gachon.ac.kr': '가천대학교',
  'https://uclass.uos.ac.kr': '서울시립대학교',

  /**
   * @TODO 반영 예정인 대학교 목록
   *
   * 'https://cn2.hongik.ac.kr': '홍익대학교',
   */
} as const

export type UniversityLink = keyof typeof UNIVERSITY_NAME_MAP
export type University = (typeof UNIVERSITY_NAME_MAP)[UniversityLink]

export const UNIVERSITY_LINK_LIST = Object.keys(UNIVERSITY_NAME_MAP) as UniversityLink[]
