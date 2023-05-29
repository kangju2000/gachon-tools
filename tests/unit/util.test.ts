import { ActivityData } from '@/data/dummyData';
import { allProgress, convertDateTime, getLinkId, timeFormat } from '@/utils';
import filteredActivities from '@/utils/filteredActivityList';

describe('getLinkId 테스트', () => {
  test('올바른 링크 입력시 id 값을 반환한다.', () => {
    const link = 'https://cyber.gachon.ac.kr/mod/assign/view.php?id=650292';
    expect(getLinkId(link)).toBe('650292');
  });

  test('링크가 없을 경우 빈 문자열을 반환한다.', () => {
    const link = '';
    const link2 = undefined;
    expect(getLinkId(link)).toBe('');
    expect(getLinkId(link2)).toBe('');
  });
});

describe('filteredActivityList 테스트', () => {
  beforeAll(() => {
    const time = new Date('2022-11-01T00:00:00Z');
    jest.useFakeTimers({});
    jest.setSystemTime(time);
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  test('진행중인 과제의 개수가 올바르게 나오는지 확인한다.', () => {
    const activityList = ActivityData;
    const selectedCourseId = '-1';
    const status = '진행중인 과제';
    const isChecked = false;
    const filteredList = filteredActivities(activityList, selectedCourseId, status, isChecked);

    expect(filteredList.length).toBe(26);
  });

  test('특정 과제 선택, 전체 과제로 올바르게 필터링 되는지 확인한다.', () => {
    const activityList = ActivityData;
    const selectedCourseId = '82194'; // 알고리즘 강의
    const status = '전체 과제';
    const isChecked = false;
    const filteredList = filteredActivities(activityList, selectedCourseId, status, isChecked);

    expect(filteredList.length).toBe(16);
  });

  test('특정 과제 선택, 진행중인 과제로 올바르게 필터링 되는지 확인한다.', () => {
    const activityList = ActivityData;
    const selectedCourseId = '82194'; // 알고리즘 강의
    const status = '진행중인 과제';
    const isChecked = false;
    const filteredList = filteredActivities(activityList, selectedCourseId, status, isChecked);

    expect(filteredList.length).toBe(9);
  });

  test('특정 과제 선택, 미제출 과제로 올바르게 필터링 되는지 확인한다.', () => {
    const activityList = ActivityData;
    const selectedCourseId = '82194'; // 알고리즘 강의
    const status = '전체 과제';
    const isChecked = true;
    const filteredList = filteredActivities(activityList, selectedCourseId, status, isChecked);

    expect(filteredList.length).toBe(2);
  });
});

describe('pipe 테스트', () => {
  test('함수를 인자로 받아서 함수를 리턴한다.', () => {
    const add = (a: number) => (b: number) => a + b;
    const add10 = add(10);
    expect(add10(5)).toBe(15);
  });
});

describe('timeFormat 테스트', () => {
  beforeAll(() => {
    const time = new Date('2023-01-01T00:00:00Z');
    jest.useFakeTimers({});
    jest.setSystemTime(time);
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  test('마감기한이 지났을 경우 제출마감을 반환한다.', () => {
    const endAt = '2022-12-12T00:00:00Z';
    expect(timeFormat(endAt)).toBe('제출마감');
  });

  test('오늘까지 마감이면 D-day를 반환한다.', () => {
    const endAt = '2023-01-01T00:00:00Z';
    expect(timeFormat(endAt)).toBe('D-day');

    const endAt2 = '2023-01-01T23:59:59Z';
    expect(timeFormat(endAt2)).toBe('D-day');
  });

  test('오늘 이후 마감이면 D-n을 반환한다.', () => {
    const endAt = '2023-01-02T00:00:00Z';
    expect(timeFormat(endAt)).toBe('D-1');

    const endAt2 = '2023-01-03T00:00:00Z';
    expect(timeFormat(endAt2)).toBe('D-2');

    const endAt3 = '2023-01-11T00:00:00Z';
    expect(timeFormat(endAt3)).toBe('D-10');
  });
});

describe('convertDateTime 테스트', () => {
  test('날짜를 올바르게 변환한다.', () => {
    const dateTime = '2022-03-15 23:59:59';
    expect(convertDateTime(dateTime)).toBe('03월 15일 (화) 23시 59분');

    const dateTime2 = '2023-05-21 23:59:59';
    expect(convertDateTime(dateTime2)).toBe('05월 21일 (일) 23시 59분');
  });

  test('날짜가 없으면 빈 문자열을 반환한다.', () => {
    const dateTime = '';
    expect(convertDateTime(dateTime)).toBe('');
  });
});

describe('allProgress 테스트', () => {
  test('프로미스 배열을 받아서 프로미스 배열을 반환한다.', async () => {
    const fakePrmoise = (time: number) =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(time);
        }, time);
      });
    const promise = [fakePrmoise(1000), fakePrmoise(2000)];
    const callback = jest.fn();
    const a = await allProgress(promise, callback);
    expect(a).toEqual([1000, 2000]);
    expect(callback).toBeCalledTimes(3);
    [0, 50, 100].forEach(progress => {
      expect(callback).toBeCalledWith(progress);
    });
  });
});