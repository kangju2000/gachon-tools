import React, { useState, useEffect, useRef, ReactNode } from 'react'

type PopoverProps = {
  trigger: ReactNode
  content: ReactNode
  contentClassName?: string
}

const Popover: React.FC<PopoverProps> = ({ trigger, content, contentClassName }) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute z-10 mt-2 rounded-8px bg-white shadow-lg dark:bg-gray-800 ${contentClassName}`}
          role="dialog"
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default Popover
