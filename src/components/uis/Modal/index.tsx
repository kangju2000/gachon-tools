import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef } from 'react';

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
};

const Modal = ({ isOpen, className, children }: ModalProps) => {
  return isOpen ? <div className={`bg-white ${className}`}>{children}</div> : null;
};

type ModalBackgroundProps = {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
};

const ModalBackground = (
  { isOpen, children, className, onClick }: ModalBackgroundProps,
  ref: React.RefObject<HTMLDivElement>,
) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
          onClick={onClick}
          ref={ref}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Modal.Background = forwardRef(ModalBackground);

export default Modal;
