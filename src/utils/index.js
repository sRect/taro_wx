export const hasOwnProperty = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
