chrome.runtime.onInstalled.addListener(async () => {
  for (const cs of chrome.runtime.getManifest().content_scripts ?? []) {
    for (const tab of await chrome.tabs.query({ url: cs.matches ?? [] })) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id ?? 0 },
        files: cs.js ?? [],
      })
      cs.css?.forEach(css => {
        chrome.scripting.insertCSS({
          target: { tabId: tab.id ?? 0 },
          files: [css],
        })
      })
    }
  }
})

chrome.runtime.onUpdateAvailable.addListener(() => {
  chrome.runtime.reload()
})

chrome.runtime.onConnect.addListener(port => {
  console.log('Connected .....', port)

  if (port.name === '@crx/client') {
    port.onMessage.addListener(msg => {
      console.log('message received', msg)
    })
  }
})

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    for (const key of Object.keys(changes)) {
      console.log(`storage.local.${key} changed`)
    }
  }
})

// 알림 스케줄링
const REMINDER_ALARM_PREFIX = 'gt-reminder-'

function scheduleReminderAlarms() {
  chrome.storage.local.get(['contents', 'settings', 'reminders'], data => {
    const activityList: Array<{
      id: string
      title: string
      endAt: string
      courseTitle: string
      hasSubmitted: boolean
    }> = data.contents?.activityList ?? []
    const enabledIds: string[] = data.reminders?.enabledActivityIds ?? []
    const hoursBefore: number[] = data.settings?.reminders?.hoursBefore ?? []
    const daysBefore: number[] = data.settings?.reminders?.daysBefore ?? []

    // 기존 알람 정리
    chrome.alarms.getAll(alarms => {
      alarms.filter(a => a.name.startsWith(REMINDER_ALARM_PREFIX)).forEach(a => chrome.alarms.clear(a.name))

      const now = Date.now()
      for (const activity of activityList) {
        if (!enabledIds.includes(activity.id) || activity.hasSubmitted) continue
        const endAtMs = new Date(activity.endAt).getTime()
        const offsetsMs = [...hoursBefore.map(h => h * 60 * 60 * 1000), ...daysBefore.map(d => d * 24 * 60 * 60 * 1000)]
        for (const offset of offsetsMs) {
          const when = endAtMs - offset
          if (when > now) {
            const name = `${REMINDER_ALARM_PREFIX}${activity.id}-${offset}`
            chrome.alarms.create(name, { when })
          }
        }
      }
    })
  })
}

chrome.alarms.onAlarm.addListener(alarm => {
  if (!alarm.name.startsWith(REMINDER_ALARM_PREFIX)) return
  const [, rest] = alarm.name.split(REMINDER_ALARM_PREFIX)
  const [activityId] = rest.split('-')

  chrome.storage.local.get(['contents'], data => {
    const activity = (data.contents?.activityList ?? []).find(
      (a: { id: string; title: string; endAt: string; courseTitle: string; hasSubmitted?: boolean }) =>
        a.id === activityId,
    )
    if (!activity) return
    chrome.notifications.create(alarm.name, {
      type: 'basic',
      iconUrl: 'assets/logo128.png',
      title: '과제 리마인드',
      message: `${activity.courseTitle} - ${activity.title}\n마감 임박: ${activity.endAt}`,
      priority: 2,
    })
  })
})

chrome.runtime.onInstalled.addListener(() => scheduleReminderAlarms())
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && (changes.reminders || changes.contents || changes.settings)) {
    scheduleReminderAlarms()
  }
})

function ensureNotificationPermission() {
  const fn = chrome.notifications.getPermissionLevel
  if (typeof fn === 'function') {
    try {
      fn(level => {
        if (level === 'denied') {
          console.warn('Notifications permission denied by the browser')
        }
      })
    } catch (_) {
      // no-op
    }
  }
}

ensureNotificationPermission()

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'GT_TEST_NOTIFY' || message?.type === 'sendTestNotification') {
    const id = `gt-test-${Date.now()}`
    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: 'assets/logo128.png',
      title: '테스트 알림',
      message: '알림이 정상적으로 표시됩니다.',
      priority: 2,
    })
    sendResponse({ ok: true })
    return true
  }
})

export {}
