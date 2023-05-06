import { createRoot } from 'react-dom/client';

import Content from '@/pages/content/Content';
import Popup from '@/pages/popup/Popup';
import '@/styles/globals.css';

createRoot(document.getElementById('popup') as HTMLElement).render(<Popup />);
createRoot(document.getElementById('content') as HTMLElement).render(<Content />);
