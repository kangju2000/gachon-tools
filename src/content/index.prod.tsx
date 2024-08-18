import Content from './Content'
import styles from '@/assets/styles/index.css?inline'
import createShadowRoot from '@/utils/createShadowRoot'

// remove scroll to top button
document.getElementById('back-top')?.remove()

const root = createShadowRoot(styles)

root.render(<Content />)
