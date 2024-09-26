import { Copy } from 'lucide-react'

import packageJson from '../../../package.json'
import { chromeStorageClient } from '@/storage/chromeStorageClient'
import { useStorageStore } from '@/storage/useStorageStore'

import type { FallbackProps } from 'react-error-boundary'

export function ErrorFallback({ error }: FallbackProps) {
  const { resetStore } = useStorageStore()

  return (
    <div>
      <div className="d-mask d-mask-squircle fixed bottom-25px right-25px h-56px w-56px cursor-pointer bg-rose-400 bg-cover bg-center bg-no-repeat shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl font-bold text-white">!</div>
        </div>
      </div>
      <div className="fixed bottom-96px right-25px h-600px w-350px overflow-hidden rounded-36px bg-slate-100 p-16px shadow-[0_0_100px_0_rgba(0,0,0,0.2)] backdrop-blur-sm">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="whitespace-pre-line break-words text-xl font-bold text-gray-800">
            확장 프로그램에 문제가 발생했어요 😢
          </div>
          <div className="relative mt-4 h-124px w-full overflow-hidden whitespace-pre-wrap rounded-lg bg-white p-4 text-left text-12px text-gray-500">
            <button
              onClick={() => navigator.clipboard.writeText(error.stack)}
              className="absolute right-4 top-4 rounded-lg bg-white bg-opacity-50 p-2 backdrop-blur-sm"
            >
              <Copy size={16} />
            </button>
            <div className="h-full overflow-auto">
              <pre className="whitespace-pre-wrap break-words">{error.stack}</pre>
            </div>
          </div>
          <div className="flex gap-16px">
            <button
              onClick={() => {
                resetStore()
                window.location.reload()
              }}
              className="mt-16px rounded-lg bg-rose-400 px-12px py-8px font-bold text-white"
            >
              다시 시작하기
            </button>

            <button
              onClick={async e => {
                const data = await chromeStorageClient.getData()
                navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                ;(e.target as HTMLButtonElement).innerText = '복사 완료!'

                setTimeout(() => {
                  ;(e.target as HTMLButtonElement).innerText = '데이터 복사하기'
                }, 2000)
              }}
              className="mt-16px rounded-lg bg-gray-500 px-12px py-8px font-bold text-white"
            >
              데이터 복사하기
            </button>
          </div>
          <div className="mt-16px text-sm text-gray-500">버전: {packageJson.version}</div>
        </div>
      </div>
    </div>
  )
}
