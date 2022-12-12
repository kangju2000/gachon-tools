import { createRoot } from 'react-dom/client';
import Popup from '@pages/popup/Popup';
import '@styles/globals.css';
import '@styles/reset.css';

createRoot(document.getElementById('root') as HTMLElement).render(<Popup />);
