import { motion } from 'framer-motion'

interface ToggleProps {
  isOn: boolean
  toggleSwitch: () => void
}

const Toggle = ({ isOn, toggleSwitch }: ToggleProps) => {
  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
  }

  return (
    <div
      className={`flex h-5 w-8 cursor-pointer items-center rounded-full bg-opacity-40 p-1 ${
        isOn ? 'justify-end bg-green-600' : 'justify-start bg-black'
      }`}
      onClick={toggleSwitch}
    >
      <motion.div
        className="h-3.5 w-3.5 rounded-full bg-white"
        layout
        transition={spring}
      ></motion.div>
    </div>
  )
}

export default Toggle
