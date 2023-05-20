import { useState } from 'react';

const useError = () => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }

  return setError;
};

export default useError;
