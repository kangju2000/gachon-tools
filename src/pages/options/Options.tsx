import packageJson from '../../../package.json';

import OptionItem from '@/components/domains/OptionItem';
const { version } = packageJson;

function Options() {
  return (
    <div className="fixed left-1/2 top-1/2 h-[600px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-200 p-4 text-black">
      <h1 className="text-center text-2xl">설정</h1>
      <hr className="my-5" />
      <ul className="flex flex-col items-center">
        <OptionItem text="언어 설정" />
      </ul>
      <p>version: {version}</p>
    </div>
  );
}

export default Options;
