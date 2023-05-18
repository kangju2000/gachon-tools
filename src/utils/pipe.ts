export default function pipe<T>(value: T, ...funcs: ((value: T) => T)[]) {
  let acc = value;
  for (const f of funcs) {
    acc = f(acc);
  }
  return acc;
}
