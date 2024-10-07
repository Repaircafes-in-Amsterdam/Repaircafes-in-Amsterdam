declare module "*.svg?react" {
  import type { ReactElement, SVGProps } from "react";

  const content: (
    props: SVGProps<SVGElement> | { title: string },
  ) => ReactElement;
  export default content;
}
