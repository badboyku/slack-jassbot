import type { GetFakedataPrefixResult } from '@types';

const getFakedataPrefix = (): GetFakedataPrefixResult => {
  const fakedataPrefix = process.env.FAKEDATA_PREFIX || undefined;
  let error: string | undefined;

  if (!fakedataPrefix) {
    error = 'Missing env variable: FAKEDATA_PREFIX';
  } else if (fakedataPrefix === 'CHANGEME') {
    error = 'Invalid env variable: FAKEDATA_PREFIX, must not be CHANGEME';
  }

  return { fakedataPrefix, error };
};

export default { getFakedataPrefix };
