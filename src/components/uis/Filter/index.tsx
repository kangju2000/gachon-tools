import { ReactComponent as CheckIcon } from '@assets/check.svg';
import { ReactComponent as DropdownIcon } from '@assets/dropdown.svg';
import { ReactComponent as DropupIcon } from '@assets/dropup.svg';
import Modal from '@components/uis/Modal';
import { createContext, useContext, useState } from 'react';

type FilterProps<T> = {
  value: T;
  children: React.ReactNode;
  maxWidth?: string;
  hasBorder?: boolean;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
};

const FilterDataContext = createContext<Pick<FilterProps<unknown>, 'value'> | null>(null);

const OpenClosedContext = createContext<{ isOpen: boolean; toggleModal: () => void } | null>(null);

let handleChange: React.Dispatch<React.SetStateAction<unknown>> | undefined;

const Filter = <T extends object | string>({
  value,
  maxWidth,
  onChange,
  children,
  hasBorder = true,
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
      <FilterDataContext.Provider value={{ value }}>
        <div
          className={`relative flex items-center p-[12px]
        ${hasBorder && 'border-[#C7CCDE] border-solid border-[1px] rounded-[8px]'}`}
          style={{ maxWidth }}
          onClick={toggleModal}
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
  name: string;
  className?: string;
};

const FilterHeader = ({ name, className }: FilterHeaderProps) => {
  return <h3 className={`single-line-ellipsis text-[14px] ${className}`}>{name}</h3>;
};

type FilterModalProps = {
  children: React.ReactNode;
  pos?: 'left' | 'right';
};

const FilterModal = ({ children, pos = 'right' }: FilterModalProps) => {
  const { isOpen } = useContext(OpenClosedContext);

  return (
    <Modal
      isOpen={isOpen}
      className={`absolute flex flex-col top-[55px] justify-center max-w-[200px] p-[8px] rounded-[10px] z-10 shadow-modal-sm
        ${pos === 'left' ? 'left-0' : 'right-0'}
      `}
    >
      {children}
    </Modal>
  );
};
type FilterItemProps<T> = {
  item: T;
  children: React.ReactNode;
};

const FilterItem = <T extends object | string>({ item, children }: FilterItemProps<T>) => {
  const { value } = useContext(FilterDataContext);

  const isChecked = value === item;

  const handleClick = () => {
    if (isChecked) return;

    handleChange(item);
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
      <p className="pl-[5px] text-[14px] single-line-ellipsis">{children}</p>
    </div>
  );
};

Filter.Header = FilterHeader;
Filter.Modal = FilterModal;
Filter.Item = FilterItem;

export default Filter;
