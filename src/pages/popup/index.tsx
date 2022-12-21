import { createRoot } from 'react-dom/client';
import Popup from '@pages/popup/Popup';
import '@styles/globals.scss';

createRoot(document.getElementById('app-container') as HTMLElement).render(<Popup />);
