type Props = {
  isOpen: boolean;
  children: React.ReactNode;
};

const Modal = ({ isOpen, children }: Props) => {
  return isOpen ? (
    <div className="fixed bottom-28 left-1/2 translate-x-[-50%] w-[500px] h-[600px] p-[20px] bg-[#7693AA] rounded-[16px] overflow-hidden overflow-y-scroll">
      {children}
    </div>
  ) : null;
};

export default Modal;
