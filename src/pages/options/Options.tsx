import packageJson from '../../../package.json';

const { version } = packageJson;

function Options() {
  return (
    <div className="fixed left-1/2 top-1/2 flex h-[600px] w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-slate-200 p-4 text-black">
      <h1 className="text-center text-2xl">설정</h1>
      <div className="relative grid grid-cols-auto-1fr gap-3 border-t-[1px] border-solid border-gray-400 px-2 py-4 text-[14px]">
        <div className="relative">
          언어 설정
          <div className="absolute -right-2 -top-4 h-[300px] w-[1px] bg-gray-400"></div>
        </div>
        <div>한국어 / 영어</div>
        <div>숨긴과제 관리</div>
        <div className="h-[100px] bg-black"></div>
      </div>
      <p className="absolute bottom-5 right-5 text-[12px]">version: {version}</p>
    </div>
  );
}

export default Options;
