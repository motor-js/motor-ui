export const calcDisplayOption = (value, useDDefaultValue = false) => {
  if (typeof value !== 'boolean') return value;

  if (value) {
    return useDDefaultValue ? 'default' : 'both';
  } else {
    return 'none';
  }
};
