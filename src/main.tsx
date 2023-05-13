import { createRoot } from 'react-dom/client';

import Content from '@/pages/content/Content';
import '@/styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';

createRoot(document.getElementById('content') as HTMLElement).render(<Content />);
