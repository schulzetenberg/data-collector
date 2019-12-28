// https://stackoverflow.com/a/4149393
export const parseCamelCase = (text = ''): string => {
  return text.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => {
    return str.toUpperCase();
  });
};

export const test = 'test'; // TODO: delete
