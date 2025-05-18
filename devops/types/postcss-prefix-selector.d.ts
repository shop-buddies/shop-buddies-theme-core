declare module 'postcss-prefix-selector' {
  import { Plugin } from 'postcss';

  interface PrefixSelectorOptions {
    prefix?: string;
    transform?: (prefix: string | null, selector: string) => string;
  }

  function prefixSelector(options?: PrefixSelectorOptions): Plugin;
  export default prefixSelector;
} 