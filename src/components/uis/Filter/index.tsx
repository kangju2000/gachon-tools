import { ReactComponent as CheckIcon } from '@assets/check.svg';
import { ReactComponent as DropdownIcon } from '@assets/dropdown.svg';
import { ReactComponent as DropupIcon } from '@assets/dropup.svg';
import Modal from '@components/uis/Modal';
import { createContext, useContext, useState } from 'react';

type FilterProps<T> = {
  value: T;
  valueList: T[];
  children: React.ReactNode;
  width?: string;
  hasBorder?: boolean;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
};

const FilterDataContext = createContext<Pick<FilterProps<unknown>, 'value' | 'valueList'> | null>(
  null,
);

const OpenClosedContext = createContext<{ isOpen: boolean; toggleModal: () => void } | null>(null);

let handleChange: React.Dispatch<React.SetStateAction<unknown>> | undefined;

const Filter = <T extends object>({
  value,
  valueList,
  hasBorder,
  width,
  onChange,
  children,
}: FilterProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(prev => !prev);
  };

  if (onChange) {
    handleChange = onChange;
  }

  return (
    <OpenClosedContext.Provider value={{ isOpen, toggleModal }}>
      <FilterDataContext.Provider value={{ value, valueList }}>
        <div
          className={`relative flex items-center p-[14px] 
        ${hasBorder && 'border-[#C7CCDE] rounded-[8px] '} 
        ${width && `w-[${width}]`}
        `}
          onClick={toggleModal}
        >
          {children}
          {isOpen ? <DropupIcon /> : <DropdownIcon />}
        </div>
      </FilterDataContext.Provider>
    </OpenClosedContext.Provider>
  );
};

type FilterHeaderProps = {
  name: string;
};

const FilterHeader = ({ name }: FilterHeaderProps) => {
  return <h3 className="text-[18px] font-bold">{name}</h3>;
};

type FilterModalProps = {
  children: React.ReactNode;
};

const FilterModal = ({ children }: FilterModalProps) => {
  const { isOpen } = useContext(OpenClosedContext);

  return (
    <Modal
      isOpen={isOpen}
      className="absolute flex flex-col justify-center top-[-10px] left-[-220px] w-[200px] p-[8px] rounded-[16px] z-10 shadow-modal-sm"
    >
      {children}
    </Modal>
  );
};
type FilterItemProps<T> = {
  item: T;
  children: React.ReactNode;
};

const FilterItem = <T extends object>({ item, children }: FilterItemProps<T>) => {
  const { value: currentValue, valueList } = useContext(FilterDataContext);

  const isChecked = currentValue === item;

  const handleClick = () => {
    if (isChecked) return;

    handleChange(valueList.find(value => value === item));
  };

  return (
    <div
      className="flex items-center p-[16px] rounded-[8px] bg-white hover:bg-[#FBF7FF]"
      onClick={handleClick}
    >
      {isChecked ? (
        <CheckIcon className="flex-shrink-0" />
      ) : (
        <div className="w-[24px] h-[24px] flex-shrink-0"></div>
      )}
      <p className="ml-[5px] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
        {children}
      </p>
    </div>
  );
};

Filter.Header = FilterHeader;
Filter.Modal = FilterModal;
Filter.Item = FilterItem;

export default Filter;
