import { createRoot } from 'react-dom/client';
import Options from '@pages/options/Options';
import '@styles/globals.css';

createRoot(document.getElementById('app-container') as HTMLElement).render(<Options />);
