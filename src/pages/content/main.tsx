import { createRoot } from 'react-dom/client'

import App from '@/pages/content/App'

const crxRoot = document.createElement('div')
crxRoot.id = 'crx-root'
document.body.append(crxRoot)

createRoot(crxRoot).render(<App />)
