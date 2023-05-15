import axios from 'axios';
import * as cheerio from 'cheerio';

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
export const getActivities = async (courseId: string) => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/course/view.php?id=${courseId}`);

  const video = $('.total_sections .activity.vod')
    .map((i, el) => {
      const id = getLinkId($(el).find('a').attr('href'));
      const title = $(el).find('.instancename').text();
      const [, endAt, timeInfo] = $(el)
        .find('.displayoptions')
        .text()
        .split(/ ~ |,/)
        .map(str => str.trim());

      return {
        type: 'video',
        hasSubmitted: false,
        id,
        courseId,
        title,
        endAt,
        timeInfo,
      };
    })
    .get();

  const assign = await getAssignments(courseId);

  if (!video.length) return { assign, video };

  const isVideoSubmittedArray = await getVideoSubmitted(courseId);

  video.forEach((v, i) => {
    v.hasSubmitted = isVideoSubmittedArray[i].hasSubmitted;
  });

  return {
    assign,
    video,
  };
};

/**
 * 강의의 과제들을 가져온다.
 * @param courseId course id
 */
const getAssignments = async (courseId: string) => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/mod/assign/index.php?id=${courseId}`);

  return $('tbody tr')
    .map((i, el) => {
      const aTag = $(el).find('a');
      if (!aTag.length) return;
      const id = getLinkId(aTag.attr('href'));
      const title = aTag.text();
      const endAt = $(el).find('.c2').text();
      const hasSubmitted = $(el).find('.c3').text() === '제출 완료';

      return {
        type: 'assignment',
        hasSubmitted,
        id,
        courseId,
        title,
        endAt,
      };
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
      const requiredTime = $(el).find('td:nth-child(3)').text();
      const totalStudyTime = $(el).find('td:nth-child(4)').text();
      const hasSubmitted = requiredTime.replace(/:/g, '') <= totalStudyTime.replace(/:/g, '');
      return {
        hasSubmitted,
      };
    })
    .get();
};
