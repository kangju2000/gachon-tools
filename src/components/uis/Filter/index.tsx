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
        ${hasBorder && 'rounded-[8px] border-[1px] border-solid border-[#C7CCDE]'}`}
          style={{ maxWidth }}
          onClick={() => setIsOpen(prev => !prev)}
        >
          {children}
          {isOpen ? (
            <DropupIcon className="ml-[5px] flex-shrink-0" />
          ) : (
            <DropdownIcon className="ml-[5px] flex-shrink-0" />
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
      <Modal className="flex max-w-[200px] flex-col justify-center rounded-[16px] p-[8px] shadow-modal-sm">
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
      className="flex items-center rounded-[8px] bg-white p-[8px] hover:bg-[#FBF7FF]"
      onClick={handleClick}
    >
      {isChecked ? (
        <CheckIcon className="flex-shrink-0" width={16} height={16} />
      ) : (
        <div className="h-[16px] w-[16px] flex-shrink-0"></div>
      )}
      <p className="single-line-ellipsis pl-[5px] text-[14px]">{item.title}</p>
    </div>
  );
};

Filter.Header = FilterHeader;
Filter.Modal = FilterModal;
Filter.Item = FilterItem;

export default Filter;
