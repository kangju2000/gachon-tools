import { createRoot } from 'react-dom/client';

import Popup from '@/pages/popup/Popup';
import '@/styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';

createRoot(document.getElementById('app-container') as HTMLElement).render(<Popup />);
