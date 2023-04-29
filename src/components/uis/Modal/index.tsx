type Props = {
  isOpen: boolean;
  children: React.ReactNode;
};

const Modal = ({ isOpen, children }: Props) => {
  return isOpen ? (
    <div className="fixed bottom-28 left-1/2 translate-x-[-50%] w-[770px] h-[500px] p-[80px] bg-white rounded-[36px] overflow-hidden overflow-y-scroll shadow-modal-lg">
      {children}
    </div>
  ) : null;
};

export default Modal;
