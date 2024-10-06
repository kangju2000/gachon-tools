export const UNIVERITY_NAME_MAP = {
  'https://cyber.gachon.ac.kr': '가천대학교',
  'https://uclass.uos.ac.kr': '서울시립대학교',

  /**
   * @TODO 반영 예정인 대학교 목록
   *
   * 'https://cn2.hongik.ac.kr': '홍익대학교',
   */
} as const

export type UniversityLink = keyof typeof UNIVERITY_NAME_MAP
export type University = (typeof UNIVERITY_NAME_MAP)[UniversityLink]

export const UNIVERITY_LINK_LIST = Object.keys(UNIVERITY_NAME_MAP) as UniversityLink[]
