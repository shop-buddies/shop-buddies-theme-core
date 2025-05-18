interface ErrorLog {
  message: string;
  handlerPath: string;
  errorMessage: string;
}

export const errorLogger = (message: string, err: Error, handleUrl: string): ErrorLog => {
  return {
    message,
    handlerPath: handleUrl,
    errorMessage: err.message,
  };
};

export default errorLogger; 