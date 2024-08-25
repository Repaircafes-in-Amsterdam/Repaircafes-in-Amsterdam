import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a(props) {
      return <a {...props} target="_blank" rel="noopener" />;
    },
  };
}
