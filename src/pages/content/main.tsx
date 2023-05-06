import { createRoot } from 'react-dom/client';

import Content from '@/pages/content/Content';

const root = document.createElement('div');
root.id = 'root';
root.style.position = 'absolute';
root.style.top = '0';
root.style.left = '0';

const modal = document.createElement('div');
modal.id = 'modal';

document.body.appendChild(root);
document.body.appendChild(modal);

createRoot(root).render(<Content />);
