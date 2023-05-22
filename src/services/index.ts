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
  const assignmentAtCourseDocument = getAssignmentAtCourseDocument($, courseId);
  const videoAtCourseDocument = getVideoAtCourseDocument($, courseId);

  const assignmentSubmittedArray = await getAssignmentSubmitted(courseId);
  const videoSubmittedArray = await getVideoSubmitted(courseId);

  const assignment = assignmentAtCourseDocument.reduce((acc, cur) => {
    const findAssignment = assignmentSubmittedArray.find(a => a.title === cur.title);
    if (findAssignment) return [...acc, Object.assign({}, cur, findAssignment)];

    console.log('assignment', cur.title);
    captureException(new Error(`getActivities에서 findAssignment 없음. ${cur.title}`));
    return acc;
  }, []);

  const video = videoAtCourseDocument.reduce((acc, cur) => {
    const findVideo = videoSubmittedArray.find(v => v.title === cur.title);
    if (findVideo) return [...acc, Object.assign({}, cur, findVideo)];

    console.log('video', cur.title);
    captureException(new Error(`getActivities에서 findVideo 없음. ${cur.title}`));
    return acc;
  }, []);

  return [...assignment, ...video];
};

/**
 * 강의 페이지의 document에서 과제를 가져온다.
 * @param $
 * @param courseId
 */
const getAssignmentAtCourseDocument = ($: cheerio.CheerioAPI, courseId: string) => {
  const sectionOne = $('#section-0 .modtype_assign .activityinstance').map((i, el) => {
    const link = $(el).find('a').attr('href');

    const id = getLinkId(link);
    const title = $(el).find('.instancename').clone().children().remove().end().text().trim();

    const assignment: Assignment = {
      type: 'assignment',
      hasSubmitted: false,
      id,
      courseId,
      title,
      startAt: '',
      endAt: '',
    };

    return assignment;
  });
  const sectionTwo = $('.total_sections .modtype_assign .activityinstance').map((i, el) => {
    const link = $(el).find('a').attr('href'); // 링크 없는 과제도 존재

    const id = getLinkId(link);
    const title = $(el).find('.instancename').clone().children().remove().end().text().trim();
    const [startAt, endAt] = $(el)
      .find('.displayoptions')
      .text()
      .split(' ~ ')
      .map(t => t.trim());

    const assignment: Assignment = {
      type: 'assignment',
      hasSubmitted: false,
      id,
      courseId,
      title,
      startAt,
      endAt,
    };

    return assignment;
  });

  return [...sectionOne.get(), ...sectionTwo.get()];
};

/**
 * 강의 페이지의 document에서 동영상 과제를 가져온다.
 * @param $
 * @param courseId
 */
const getVideoAtCourseDocument = ($: cheerio.CheerioAPI, courseId: string) => {
  return $('.total_sections .activity.vod .activityinstance')
    .map((i, el) => {
      const link = $(el).find('a').attr('href'); // 링크 없는 과제도 존재

      const id = getLinkId(link);
      const title = $(el).find('.instancename').clone().children().remove().end().text().trim();
      const [startAt, endAt] = $(el)
        .find('.displayoptions .text-ubstrap')
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .split(' ~ ')
        .map(t => t.trim());
      const timeInfo = $(el).find('.displayoptions .time-info').text();

      if (!id) {
        captureException(
          new Error(`getVideoAtCourseDocument에서 id 없음. ${title} / ${startAt} / ${endAt}`),
        );
      }

      return {
        type: 'video',
        hasSubmitted: false,
        id,
        courseId,
        title,
        startAt,
        endAt,
        timeInfo,
      };
    })
    .get();
};

/**
 * 강의의 과제 제출 여부를 가져온다.
 * @param courseId course id
 */
const getAssignmentSubmitted = async (courseId: string) => {
  const $ = await fetchDocument(`https://cyber.gachon.ac.kr/mod/assign/index.php?id=${courseId}`);

  return $('tbody tr')
    .map((i, el) => {
      if ($(el).find('.tabledivider').length) return;
      const title = $(el).find('a').text().trim();
      const hasSubmitted = /(Submitted for grading)|(제출 완료)/.test($(el).find('.c3').text());
      const endAt = $(el).find('.c2').text().trim() + ':00';

      return {
        title,
        hasSubmitted,
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
    `https://cyber.gachon.ac.kr/report/ubcompletion/progress.php?id=${courseId}`,
  );

  const className =
    $('.user_progress tbody tr').length === 0
      ? '.user_progress_table tbody tr'
      : '.user_progress tbody tr';

  return $(className)
    .map((i, el) => {
      const std = $(el).find('.text-center.hidden-xs.hidden-sm');
      const title = std.prev().text().trim();
      const requiredTime = std.text();
      const totalStudyTime = std.next().clone().children().remove().end().text();
      const hasSubmitted =
        Number(requiredTime.replace(/:/g, '')) <= Number(totalStudyTime.replace(/:/g, ''));

      return {
        title,
        hasSubmitted,
      };
    })
    .get();
};
