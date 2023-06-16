import { useState } from 'react';

import Toggle from '@/components/uis/Toggle';

interface OptionItemProps {
  text: string;
}

const OptionItem = ({ text }: OptionItemProps) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(prev => !prev);
    // TODO: Save the option to the local storage
  };

  return (
    <li className="flex items-center">
      <p>{text}</p>
      <Toggle isOn={isOn} toggleSwitch={toggleSwitch} />
    </li>
  );
};

export default OptionItem;
