import { captureException } from '@sentry/react';
import axios from 'axios';
import * as cheerio from 'cheerio';

import type { Assignment, Video } from '@/types';

import { getLinkId } from '@/utils';

const fetchDocument = async (url: string) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    return $;
  } catch (error) {
    console.error(error);
  }
};

/**
 * 모든 course를 가져온다.
 */
export const getCourses = async () => {
  const $ = await fetchDocument('https://cyber.gachon.ac.kr/local/ubion/user');

  const courses = $('.coursefullname').map((i, el) => {
    const id = getLinkId($(el).attr('href'));
    const title = $(el)
      .text()
      .replace(/ \((\d{5}_\d{3})\)/, '');

    return {
      id,
      title,
    };
  });

  return courses.get();
};

/**
 * 강의의 activity들을 가져온다.
 * @param courseId course id
 */
export const getActivities = async (courseId: string): Promise<(Assignment | Video)[]> => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/course/view.php?id=${courseId}`);
  const assign = await getAssignments(courseId);
  const videoAtCourseDocument = getVideoAtCourseDocument($, courseId);

  if (!videoAtCourseDocument.length) return assign;

  const isVideoSubmittedArray = await getVideoSubmitted(courseId);

  const video = videoAtCourseDocument.reduce((acc, cur) => {
    const findVideo = isVideoSubmittedArray.find(v => v.title === cur.title);
    if (findVideo) return [...acc, Object.assign({}, cur, findVideo)];
    return acc;
  }, []);

  return [...assign, ...video];
};

/**
 * 강의의 과제들을 가져온다.
 * @param courseId course id
 */
const getAssignments = async (courseId: string) => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/mod/assign/index.php?id=${courseId}`);

  return $('tbody tr:nth-child(odd)')
    .map((i, el) => {
      const aTag = $(el).find('a');
      if (!aTag.length || !aTag.attr('href')) {
        captureException(
          new Error(`
        과제 링크가 없습니다.
        courseId: ${courseId}
        aTag: ${aTag}
        `),
        );
        return null;
      }

      const id = getLinkId(aTag.attr('href'));
      const title = aTag.text();
      const endAt = $(el).find('.c2').text();
      const hasSubmitted = /(Submitted for grading)|(제출 완료)/.test($(el).find('.c3').text());

      const assignment: Assignment = {
        type: 'assignment',
        hasSubmitted,
        id,
        courseId,
        title,
        endAt,
      };

      return assignment;
    })
    .get();
};

/**
 * 강의 페이지의 document에서 비디오를 가져온다.
 * @param $
 * @param courseId
 */
const getVideoAtCourseDocument = ($: cheerio.CheerioAPI, courseId: string) => {
  return $('.total_sections .activity.vod .activityinstance')
    .map((i, el) => {
      const link = $(el).find('a').attr('href');
      if (!link) {
        captureException(new Error(`동영상 링크가 없습니다. courseId: ${courseId}`));
        return;
      }

      const id = getLinkId(link);
      const title = $(el).find('.instancename').clone().children().remove().end().text().trim();
      const [, endAt, timeInfo] = $(el)
        .find('.displayoptions')
        .text()
        .split(/ ~ |,/)
        .map(str => str.trim());

      const v: Video = {
        type: 'video',
        hasSubmitted: false,
        id,
        courseId,
        title,
        endAt,
        timeInfo,
      };

      return v;
    })
    .get();
};

/**
 * 강의의 비디오 제출 여부를 가져온다.
 * @param courseId course id
 */
const getVideoSubmitted = async (courseId: string) => {
  const $ = await fetchDocument(
    `https://cyber.gachon.ac.kr/report/ubcompletion/user_progress.php?id=${courseId}`,
  );

  return $('.user_progress tbody tr')
    .map((i, el) => {
      const std = $(el).find('.text-center.hidden-xs.hidden-sm');
      const title = std.prev().text().trim();
      const requiredTime = std.text();
      const totalStudyTime = std.next().clone().children().remove().end().text();
      const hasSubmitted = requiredTime.replace(/:/g, '') <= totalStudyTime.replace(/:/g, '');

      if (!title) captureException(new Error(`동영상 제목이 없습니다. courseId: ${courseId}`));
      if (!requiredTime)
        captureException(new Error(`동영상 출석 요구 시간이 없습니다. courseId: ${courseId}`));

      return {
        title,
        hasSubmitted,
      };
    })
    .get();
};
