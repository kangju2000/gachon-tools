import { createRoot } from 'react-dom/client'
import cropperStyles from 'react-easy-crop/react-easy-crop.css?inline'

import { App } from './App'
import { useStorageStore } from '@/storage/useStorageStore'
import styles from '@/styles/index.css?inline'
import createShadowRoot from '@/utils/createShadowRoot'

function initApp() {
  // remove scroll to top button
  document.getElementById('back-top')?.remove()

  const shadowRoot = createShadowRoot([styles, cropperStyles])
  createRoot(shadowRoot).render(<App />)

  // Always-on UI fixes (independent of settings)
  const globalFixStyleId = 'gt-global-fixes'
  if (!document.getElementById(globalFixStyleId)) {
    const s = document.createElement('style')
    s.id = globalFixStyleId
    s.textContent = `
      /* Hide completion progress bar that overlays modal */
      #completionprogressid { display: none !important; }
      /* Allow hiding of LMS notice popups regardless of Web UI enhancement */
      body.gt-hide-popups .modal.notice_popup.ui-draggable { display: none !important; visibility: hidden !important; }
    `
    document.head.appendChild(s)
  }

  // Apply Web UI enhancements if enabled
  const applyWebUiEnhancement = () => {
    const { settings } = useStorageStore.getState()
    if (!settings.webUiEnhancement) return

    try {
      // Sidebar regions
      const _sidePre = document.querySelector('#block-region-side-pre') as HTMLElement | null
      const _sidePost = document.querySelector('#block-region-side-post') as HTMLElement | null
      const pageLnb = document.querySelector('#page-lnb') as HTMLElement | null

      if (pageLnb && !document.getElementById('gt-sidebar-toggle')) {
        const btn = document.createElement('button')
        btn.id = 'gt-sidebar-toggle'
        btn.textContent = '메뉴 접기'
        btn.style.position = 'fixed'
        btn.style.top = '80px'
        btn.style.left = '8px'
        btn.style.zIndex = '9999'
        btn.style.padding = '6px 10px'
        btn.style.borderRadius = '6px'
        btn.style.border = '1px solid #e5e7eb'
        btn.style.background = '#ffffff'
        btn.style.color = '#374151'
        btn.style.fontSize = '12px'
        btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'

        const updateButton = () => {
          const hidden = document.body.classList.contains('gt-lnb-hidden')
          btn.textContent = hidden ? '메뉴 펼치기' : '메뉴 접기'
        }

        btn.addEventListener('click', () => {
          // Toggle hidden
          document.body.classList.toggle('gt-lnb-hidden')
          requestAnimationFrame(() => {
            updateButton()
          })
        })
        updateButton()
        document.body.appendChild(btn)
      }

      // Responsive fixes: constrain overflowing containers
      const styleId = 'gt-webui-enhance-style'
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          /* constrain content width and prevent overflow */
          .container, .container-fluid, .row, .course-content, #page-container, .page-content, .course-header { max-width: 100%; overflow-x: hidden; }
          img, video { max-width: 100%; height: auto; }
          /* make tables responsive */
          .table-responsive, .overflow-x-auto { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          /* reduce sidebar width on small screens */
          @media (max-width: 1024px) {
            #block-region-side-pre, #block-region-side-post { display: none !important; }
          }
          /* hidden state: hide LMS left navigation area entirely */
          body.gt-lnb-hidden #page-lnb { display: none !important; }
          body.gt-lnb-hidden #block-region-side-pre,
          body.gt-lnb-hidden #block-region-side-post { display: none !important; }
          body.gt-lnb-hidden #page-container { max-width: 100% !important; width: auto !important; margin-left: 0 !important; }

          /* hide professor info image when Web UI enhancement is active */
          body .prof_info img { display: none !important; }
        `
        document.head.appendChild(style)
      }

      // sync extra UI classes from settings
      syncHidePopups()
    } catch (e) {
      // silent
    }
  }

  // independent: hide popups according to setting, regardless of Web UI enhancement
  const syncHidePopups = () => {
    const { settings } = useStorageStore.getState()
    document.body.classList.toggle('gt-hide-popups', Boolean(settings.webUiHidePopups))
  }
  syncHidePopups()

  applyWebUiEnhancement()
  useStorageStore.subscribe(state => {
    // Re-apply on settings change
    // Always sync popup hiding independent of enhancement
    syncHidePopups()
    if (state.settings.webUiEnhancement) {
      applyWebUiEnhancement()
    } else {
      // cleanup: show sidebars and remove style/button
      document.getElementById('gt-sidebar-toggle')?.remove()
      document.getElementById('gt-webui-enhance-style')?.remove()
      const sidePreEl = document.querySelector('#block-region-side-pre') as HTMLElement | null
      if (sidePreEl) sidePreEl.style.display = ''
      document.body.classList.remove('gt-lnb-hidden')
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
