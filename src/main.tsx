import Content from '@pages/content/Content';
import Popup from '@pages/popup/Popup';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('popup') as HTMLElement).render(<Popup />);
createRoot(document.getElementById('content') as HTMLElement).render(<Content />);
