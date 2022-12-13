import { createRoot } from 'react-dom/client';
import Content from '@pages/content/Content';
import '@styles/globals.css';
import '@styles/reset.css';

const root = document.createElement('div');
root.id = 'content-view-root';

const parentElement = document.getElementById('page-content-wrap');
parentElement?.insertBefore(root, parentElement.firstChild);

createRoot(root).render(<Content />);
