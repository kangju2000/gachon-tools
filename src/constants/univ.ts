export type University = '가천대학교' | '서울시립대학교'
export const UNIVERITY_LINK_LIST = ['https://cyber.gachon.ac.kr', 'https://uclass.uos.ac.kr']

export const UNIVERITY_NAME_MAP: Record<(typeof UNIVERITY_LINK_LIST)[number], University> = {
  'https://cyber.gachon.ac.kr': '가천대학교',
  'https://uclass.uos.ac.kr': '서울시립대학교',
}
