import { allProgress, getLinkId } from '@/utils'

describe('getLinkId 테스트', () => {
  test('올바른 링크 입력시 id 값을 반환한다.', () => {
    const link = 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=650292'
    expect(getLinkId(link)).toBe('650292')
  })

  test('링크가 없을 경우 빈 문자열을 반환한다.', () => {
    const link = ''
    const link2 = undefined
    expect(getLinkId(link)).toBe('')
    expect(getLinkId(link2)).toBe('')
  })
})

describe('pipe 테스트', () => {
  test('함수를 인자로 받아서 함수를 리턴한다.', () => {
    const add = (a: number) => (b: number) => a + b
    const add10 = add(10)
    expect(add10(5)).toBe(15)
  })
})

describe('allProgress 테스트', () => {
  test('프로미스 배열을 받아서 프로미스 배열을 반환한다.', async () => {
    const fakePrmoise = (time: number) =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(time)
        }, time)
      })
    const promise = [fakePrmoise(1000), fakePrmoise(2000)]
    const callback = jest.fn()
    const a = await allProgress(promise, callback)
    expect(a).toEqual([1000, 2000])
    expect(callback).toBeCalledTimes(3)

    const array = [0, 50, 100]
    array.forEach(progress => {
      expect(callback).toBeCalledWith(progress)
    })
  })
})
