declare module 'gulp-ejs' {
  import { Transform } from 'stream';
  
  interface EjsOptions {
    locals?: Record<string, any>;
    ext?: string;
    [key: string]: any;
  }

  function ejs(options?: EjsOptions): Transform;
  export default ejs;
} 