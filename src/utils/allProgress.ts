export default async function allProgress<T>(promise: Promise<T>[], callback: (progress: number) => void) {
  let d = 0
  callback(0)
  for (const p of promise) {
    p.then(() => {
      d++
      callback((d * 100) / promise.length)
    })
  }
  return await Promise.all(promise).then(data => data.flat())
}
