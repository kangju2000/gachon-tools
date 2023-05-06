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
  onClick?: (e: React.MouseEvent) => void;
};

const ModalBackground = (
  { isOpen, children, onClick }: ModalBackgroundProps,
  ref: React.RefObject<HTMLDivElement>,
) => {
  return (
    isOpen && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)]"
        onClick={onClick}
        ref={ref}
      >
        {children}
      </div>
    )
  );
};

Modal.Background = forwardRef(ModalBackground);

export default Modal;
