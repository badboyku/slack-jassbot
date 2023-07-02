/* istanbul ignore file */
const getFakedataKey = () => {
  const key = process.env.FAKEDATA_KEY || '';
  let error: string | undefined;

  if (!key) {
    error = 'Missing env variable: FAKEDATA_KEY';
  } else if (key === 'CHANGEME') {
    error = 'Invalid env variable: FAKEDATA_KEY, must not be CHANGEME';
  }

  return { key, error };
};

export default { getFakedataKey };
