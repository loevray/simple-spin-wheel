export const getDeepCopy = (arr) =>
  arr.map((el) => {
    return { ...el };
  });
