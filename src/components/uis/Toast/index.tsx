import { useEffect, useState } from 'react'

import Modal from '../Modal'

type Props = {
  message: string
  type: 'success' | 'error'
  delay?: number
}

const Toast = ({ message, type, delay = 3000 }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const toastColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  }

  useEffect(() => {
    setIsOpen(true)
    const timer = setTimeout(() => setIsOpen(false), delay)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Modal.Background isOpen={isOpen} className="fixed left-0 top-0 z-[1999]">
      <Modal
        className={`round-[7px] border-1 fixed left-1/2 top-[20px] flex h-[50px] max-w-[200px] translate-x-[-50%] items-center justify-center rounded-[15px] p-[15px] text-white ${toastColor[type]}`}
      >
        <p>{message}</p>
      </Modal>
    </Modal.Background>
  )
}

export default Toast
