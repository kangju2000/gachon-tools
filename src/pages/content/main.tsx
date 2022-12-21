import { createRoot } from 'react-dom/client';

import Content from '@pages/content/Content';

const root = document.createElement('div');
root.id = 'root';
root.classList.add('root');

const parentElement = document.getElementById('region-main');
parentElement?.insertBefore(root, parentElement.firstChild);

createRoot(root).render(<Content />);
