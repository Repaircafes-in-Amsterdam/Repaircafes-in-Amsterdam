export default function classes(...args: unknown[]) {
  return args.flat(Infinity).filter(Boolean).join(" ");
}
