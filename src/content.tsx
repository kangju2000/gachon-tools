import { createRoot } from 'react-dom/client'

import App from '@/pages/content/App'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.append(root)

createRoot(root).render(<App />)
