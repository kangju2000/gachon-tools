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
 * 강의의 모든 activity를 가져온다.
 * @param courseId course id
 */
export const getActivities = async (courseId: string) => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/course/view.php?id=${courseId}`);

  const assign = $('.total_sections .activity.assign')
    .map((i, el) => {
      const id = getLinkId($(el).find('a').attr('href'));
      const title = $(el).find('.instancename').text();
      const [startAt, endAt] = $(el)
        .find('.displayoptions')
        .text()
        .split(' ~ ')
        .map(date => new Date(date));

      if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
        return;
      }
      return {
        id,
        courseId,
        title,
        startAt,
        endAt,
        hasSubmitted: false,
      };
    })
    .get();

  const vod = $('.total_sections .activity.vod')
    .map((i, el) => {
      const id = getLinkId($(el).find('a').attr('href'));
      const title = $(el).find('.instancename').text();
      const [startAt, endAt, timeInfo] = $(el)
        .find('.displayoptions')
        .text()
        .split(/ ~ |,/)
        .map(str => {
          const time = str.trim();
          const date = new Date(time);
          if (isNaN(date.getTime())) {
            return time;
          }
          return date;
        });

      return {
        id,
        courseId,
        title,
        startAt,
        endAt,
        timeInfo,
        hasSubmitted: false,
      };
    })
    .get();

  const assignments = await getAssignments(courseId);
  const videos = await getVideos(courseId);

  const combinedAssignments = assignments.reduce((acc, cur, idx) => {
    return acc.map((a, i) => (i === idx ? { ...a, ...cur } : a));
  }, assign);

  const combinedVideos = videos.reduce((acc, cur, idx) => {
    return acc.map((a, i) => (i === idx ? { ...a, ...cur } : a));
  }, vod);

  return {
    assign: combinedAssignments,
    video: combinedVideos,
  };
};

export const getAssignments = async (courseId: string) => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/mod/assign/index.php?id=${courseId}`);

  return $('tbody tr')
    .map((i, el) => {
      const aTag = $(el).find('a');
      if (!aTag.length) return;
      const id = getLinkId(aTag.attr('href'));
      const title = aTag.text();
      const hasSubmitted = $(el).find('.c3').text() === '제출 완료';

      return {
        id,
        courseId,
        title,
        hasSubmitted,
      };
    })
    .get();
};

export const getVideos = async (courseId: string) => {
  const $ = await fetchDocument(
    `https://cyber.gachon.ac.kr/report/ubcompletion/user_progress_a.php?id=${courseId}`,
  );

  return $('.user_progress_table tbody tr')
    .map((i, el) => {
      const title = $(el).find('td:nth-child(2)').text().trim();
      const requiredTime = $(el).find('td:nth-child(3)').text();
      const totalStudyTime = $(el).find('td:nth-child(4)').text();
      const hasSubmitted = new Date(totalStudyTime) > new Date(requiredTime);
      return {
        title,
        hasSubmitted,
      };
    })
    .get();
};
