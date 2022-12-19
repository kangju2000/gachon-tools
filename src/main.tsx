import { createRoot } from 'react-dom/client';
import Popup from '@pages/popup/Popup';
import '@styles/globals.css';
import Content from '@pages/content/Content';

createRoot(document.getElementById('popup') as HTMLElement).render(<Popup />);
createRoot(document.getElementById('content') as HTMLElement).render(<Content />);
