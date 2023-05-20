import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef } from 'react';

type ModalProps = {
  children: React.ReactNode;
  className?: string;
};

const Modal = ({ className, children }: ModalProps) => {
  return <div className={`${className ?? ''}`}>{children}</div>;
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
