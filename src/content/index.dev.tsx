import cropperStyles from 'react-easy-crop/react-easy-crop.css?inline'

import '@/styles/index.css'

import { App } from './App'
import createShadowRoot from '@/utils/createShadowRoot'

// remove scroll to top button
document.getElementById('back-top')?.remove()

const root = createShadowRoot([cropperStyles])

root.render(<App />)
