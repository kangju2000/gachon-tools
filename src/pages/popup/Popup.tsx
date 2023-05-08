import { Tooltip } from 'react-tooltip';

import { ReactComponent as FeedbackIcon } from '@/assets/feedback.svg';
import { ReactComponent as GachonIcon } from '@/assets/gachon.svg';
import { ReactComponent as GithubIcon } from '@/assets/github.svg';

function App() {
  return (
    <div className="flex flex-col items-center w-[300px] h-[250px] bg-white p-[10px]">
      <GachonIcon width={50} height={50} />
      <h1 className="text-2xl font-bold">Gachon Tools</h1>
      <p>가천대학교 사이버캠퍼스 확장 프로그램</p>
      <div className="flex-grow"></div>
      <div className="flex gap-[5px]">
        <a
          href="https://www.github.com/kangju2000/gachon-extension"
          target="_blank"
          rel="noreferrer"
          data-tooltip-id="github"
        >
          <GithubIcon />
        </a>
        <Tooltip id="github">
          <span>깃허브</span>
        </Tooltip>
        <a
          href="https://forms.gle/uM8M6ghS2ABme5s5A"
          target="_blank"
          rel="noreferrer"
          data-tooltip-id="feedback"
        >
          <FeedbackIcon className="cursor-pointer" />
        </a>
        <Tooltip id="feedback">
          <span>피드백</span>
        </Tooltip>
      </div>
    </div>
  );
}

export default App;
