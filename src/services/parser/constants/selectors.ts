import { z } from 'zod'

export const domSelectorsSchema = z.object({
  courses: z.object({
    link: z.string(),
  }),
  activities: z.object({
    sections: z.object({
      first: z.string(),
      all: z.string(),
      title: z.string(),
    }),
    assignment: z.object({
      container: z.string(),
      link: z.string(),
      title: z.string(),
      period: z.string(),
    }),
    video: z.object({
      container: z.string(),
      link: z.string(),
      title: z.string(),
      period: z.string(),
    }),
  }),
  submissions: z.object({
    assignment: z.object({
      container: z.string(),
      divider: z.string(),
      title: z.string(),
      period: z.string(),
      status: z.string(),
    }),
    video: z.object({
      container: z.string(),
      title: z.string(),
      sectionTitle: z.string(),
      requiredTime: z.string(),
      // studyTime: z.string(),
    }),
  }),
})

export const DOM_SELECTORS = domSelectorsSchema.parse({
  courses: {
    link: '.coursefullname',
  },
  activities: {
    sections: {
      first: '#section-0',
      all: '.total_sections .content',
      title: '.sectionname',
    },
    assignment: {
      container: '.modtype_assign .activityinstance',
      link: 'a',
      title: '.instancename',
      period: '.displayoptions',
    },
    video: {
      container: '.modtype_vod .activityinstance',
      link: 'a',
      title: '.instancename',
      period: '.displayoptions .text-ubstrap',
    },
  },
  submissions: {
    assignment: {
      container: 'tbody tr',
      divider: '.tabledivider',
      title: '.c1 a',
      period: '.c2',
      status: '.c3',
    },
    video: {
      container: '.user_progress tbody tr',
      title: '.text-left',
      sectionTitle: '.sectiontitle',
      requiredTime: '.text-center.hidden-xs.hidden-sm',
    },
  },
})

export type DOMSelectors = z.infer<typeof domSelectorsSchema>
