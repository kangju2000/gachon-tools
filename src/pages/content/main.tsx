import Content from '@pages/content/Content';
import { createRoot } from 'react-dom/client';

const root = document.createElement('div');
root.id = 'root';
root.style.position = 'fixed';
root.style.left = '50%';
root.style.bottom = '20px';
root.style.transform = 'translateX(-50%)';
root.style.zIndex = '1000';

const modal = document.createElement('div');
modal.id = 'modal';

document.body.appendChild(root);
document.body.appendChild(modal);

createRoot(root).render(<Content />);
