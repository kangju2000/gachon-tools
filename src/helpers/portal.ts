import { createPortal } from 'react-dom'

type Props = {
  elementId: string
  children: React.ReactNode
}

const Portal = ({ elementId, children }: Props) => {
  const el = document.getElementById(elementId) as HTMLElement
  return createPortal(children, el)
}

export default Portal
