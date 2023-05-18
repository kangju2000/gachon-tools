import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

import ContentModal from '@/components/domains/ContentModal';
import Portal from '@/helpers/portal';

export default function Content() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  return (
    <div className="fixed bottom-[25px] left-1/2 translate-x-[-50%]">
      <motion.div
        initial={{ width: '40px', height: '40px' }}
        whileHover={{ width: '100px', height: '50px' }}
        className=" rounded-[50px] bg-[#2F6EA2] shadow-md shadow-[#2F6EA2] cursor-pointer"
        onClick={() => setIsModalOpen(prev => !prev)}
      ></motion.div>
      <Portal elementId="modal">
        <ContentModal
          ref={modalRef}
          onClick={event => {
            if (event.target === modalRef.current) setIsModalOpen(false);
          }}
          isOpen={isModalOpen}
        />
      </Portal>
    </div>
  );
}
