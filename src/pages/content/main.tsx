import { createRoot } from 'react-dom/client';

import Content from '@/pages/content/Content';
import '@/styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';

const root = document.createElement('div');
root.id = 'root';

const modal = document.createElement('div');
modal.id = 'modal';

document.body.appendChild(root);
document.body.appendChild(modal);

createRoot(root).render(<Content />);
