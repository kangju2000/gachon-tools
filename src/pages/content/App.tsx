import { ErrorBoundary } from '@sentry/react';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

import ContentModal from '@/components/domains/ContentModal';
import Portal from '@/helpers/portal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  const handleModalClick = (event: React.MouseEvent) => {
    if (event.target === modalRef.current) setIsModalOpen(false);
  };

  return (
    <div className="fixed bottom-[25px] left-1/2 translate-x-[-50%]">
      <motion.div
        initial={{ width: '40px', height: '40px' }}
        whileHover={{ width: '100px', height: '50px' }}
        className="cursor-pointer rounded-[50px] bg-[#2F6EA2] shadow-md shadow-[#2F6EA2]"
        onClick={() => setIsModalOpen(prev => !prev)}
      ></motion.div>
      <ErrorBoundary fallback={<></>}>
        <Portal elementId="modal">
          <ContentModal ref={modalRef} onClick={handleModalClick} isOpen={isModalOpen} />
        </Portal>
      </ErrorBoundary>
    </div>
  );
}
