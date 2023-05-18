export default function allProgress<T>(
  proms: Promise<T>[],
  progress_cb: (progress: number) => void,
) {
  let d = 0;
  progress_cb(0);
  for (const p of proms) {
    p.then(() => {
      d++;
      progress_cb((d * 100) / proms.length);
    });
  }
  return Promise.all(proms);
}
