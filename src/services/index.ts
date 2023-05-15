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
  const $ = await fetchDocument('https://cyber.gachon.ac.kr/');

  const courses = $('.course_link').map((i, el) => {
    const id = getLinkId($(el).attr('href'));
    const title = $(el)
      .find('h3')
      .children()
      .remove()
      .end()
      .text()
      .replace(/ \((\d{5}_\d{3})\)/, '');
    const professor = $(el).find('.prof').text();

    return {
      id,
      title,
      professor,
    };
  });

  return courses.get();
};

/**
 * 강의의 모든 activity를 가져온다.
 * @param id course id
 */
export const getActivities = async (courseId: string) => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/course/view.php?id=${courseId}`);

  const assign = $('.total_sections .activity.assign').map((i, el) => {
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
    };
  });

  const vod = $('.total_sections .activity.vod').map((i, el) => {
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
    };
  });
  console.log(assign.get(), vod.get());

  return {
    assign: assign.get(),
    vod: vod.get(),
  };
};
