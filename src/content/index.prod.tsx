import Content from './Content'
import styles from '@/assets/styles/index.css?inline'
import createShadowRoot from '@/utils/createShadowRoot'

const root = createShadowRoot(styles)

root.render(<Content />)
