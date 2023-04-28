import Popup from '@pages/popup/Popup';
import { createRoot } from 'react-dom/client';
import '@styles/globals.css';

createRoot(document.getElementById('app-container') as HTMLElement).render(<Popup />);
