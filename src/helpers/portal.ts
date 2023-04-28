import ReactDom from 'react-dom';

type Props = {
  elementId: string;
  children: React.ReactNode;
};

const Portal = ({ elementId, children }: Props) => {
  const el = document.getElementById(elementId) as HTMLElement;
  return ReactDom.createPortal(children, el);
};

export default Portal;
