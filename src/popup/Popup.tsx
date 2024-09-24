import { GachonLogoIcon, GithubIcon, FeedbackIcon, NotionIcon } from '@/components/Icons'

function App() {
  return (
    <div className="flex h-250px w-250px flex-col items-center justify-center bg-white p-10px">
      <GachonLogoIcon className="h-50px w-50px" />
      <h1 className="text-24px font-bold">Gachon Tools</h1>
      <p className="text-14px">가천대학교 사이버캠퍼스 확장 프로그램</p>
      <div className="flex-grow"></div>
      <div className="mt-10px flex gap-5px">
        <div className="tooltip" data-tip="깃허브">
          <a
            href="https://www.github.com/kangju2000/gachon-extension"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-circle btn-sm"
          >
            <GithubIcon className="h-20px w-20px" />
          </a>
        </div>
        <div className="tooltip" data-tip="피드백">
          <a
            href="https://forms.gle/uM8M6ghS2ABme5s5A"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-circle btn-sm"
          >
            <FeedbackIcon className="h-20px w-20px" />
          </a>
        </div>
        <div className="tooltip" data-tip="노션">
          <a
            href="https://kangju2000.notion.site/Gachon-Tools-f01d077db229434abfce605c2d26f682?pvs=4"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-circle btn-sm"
          >
            <NotionIcon className="h-20px w-20px" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
