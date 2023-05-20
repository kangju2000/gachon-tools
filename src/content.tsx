import { createRoot } from 'react-dom/client';

import App from '@/pages/content/App';

import '@/styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';

const root = document.createElement('div');
root.id = 'crx-root';
document.body.append(root);

createRoot(root).render(<App />);
