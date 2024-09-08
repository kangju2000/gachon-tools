import Options from './Options'
import styles from '@/styles/index.css?inline'
import createShadowRoot from '@/utils/createShadowRoot'

const root = createShadowRoot(styles)

root.render(<Options />)
