import { createContext, useContext, useState } from 'react';

import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import { ReactComponent as DropdownIcon } from '@/assets/dropdown.svg';
import { ReactComponent as DropupIcon } from '@/assets/dropup.svg';
import Modal from '@/components/uis/Modal';

type valueType = { title: string; [key: string]: any };

type FilterProps = {
  value: valueType;
  onChange: React.Dispatch<React.SetStateAction<valueType>>;
  children: React.ReactNode;
  maxWidth?: string;
  hasBorder?: boolean;
};

const FilterDataContext = createContext<Pick<FilterProps, 'value' | 'onChange'> | null>(null);
const OpenClosedContext = createContext<{ isOpen: boolean } | null>(null);

const Filter = ({ value, maxWidth, onChange, children, hasBorder = true }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <OpenClosedContext.Provider value={{ isOpen }}>
      <FilterDataContext.Provider value={{ value, onChange }}>
        <div
          className={`relative flex items-center p-[12px]
        ${hasBorder && 'border-[#C7CCDE] border-solid border-[1px] rounded-[8px]'}`}
          style={{ maxWidth }}
          onClick={() => setIsOpen(prev => !prev)}
        >
          {children}
          {isOpen ? (
            <DropupIcon className="flex-shrink-0 ml-[5px]" />
          ) : (
            <DropdownIcon className="flex-shrink-0 ml-[5px]" />
          )}
        </div>
      </FilterDataContext.Provider>
    </OpenClosedContext.Provider>
  );
};

type FilterHeaderProps = {
  className?: string;
};

const FilterHeader = ({ className }: FilterHeaderProps) => {
  const { value } = useContext(FilterDataContext);
  return <h3 className={`single-line-ellipsis text-[14px] ${className ?? ''}`}>{value.title}</h3>;
};

type FilterModalProps = {
  children: React.ReactNode;
  pos?: 'left' | 'right';
};

const FilterModal = ({ children, pos = 'right' }: FilterModalProps) => {
  const { isOpen } = useContext(OpenClosedContext);

  return (
    <Modal.Background
      className={`absolute top-[55px] z-10 ${pos === 'left' ? 'left-0' : 'right-0'}`}
      isOpen={isOpen}
    >
      <Modal className="flex flex-col justify-center max-w-[200px] p-[8px] rounded-[16px] shadow-modal-sm">
        {children}
      </Modal>
    </Modal.Background>
  );
};

type FilterItemProps = {
  item: valueType;
};

const FilterItem = ({ item }: FilterItemProps) => {
  const { value, onChange } = useContext(FilterDataContext);
  const isChecked = value === item;

  const handleClick = () => {
    if (isChecked) return;
    onChange(item);
  };

  return (
    <div
      className="flex items-center p-[8px] rounded-[8px] bg-white hover:bg-[#FBF7FF]"
      onClick={handleClick}
    >
      {isChecked ? (
        <CheckIcon className="flex-shrink-0" width={16} height={16} />
      ) : (
        <div className="w-[16px] h-[16px] flex-shrink-0"></div>
      )}
      <p className="pl-[5px] text-[14px] single-line-ellipsis">{item.title}</p>
    </div>
  );
};

Filter.Header = FilterHeader;
Filter.Modal = FilterModal;
Filter.Item = FilterItem;

export default Filter;
