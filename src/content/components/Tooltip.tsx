import React from 'react'

interface TooltipProps {
  content: string
  position: { x: number; y: number }
}

export const Tooltip: React.FC<TooltipProps> = ({ content, position }) => {
  return (
    <div
      className="fixed z-50 rounded bg-gray-800 px-2 py-1 text-10px text-white"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {content}
    </div>
  )
}
