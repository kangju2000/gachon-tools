type Props = {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
};

const Modal = ({ isOpen, className, children }: Props) => {
  return isOpen ? <div className={`bg-white rounded-[36px] ${className}`}>{children}</div> : null;
};

export default Modal;
