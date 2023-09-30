// Функция фильтрации массива
export default function filterArray(searchText, returnedArr, cachedArr, key) {
  returnedArr = cachedArr.filter((item) => {
    const regex = new RegExp(searchText, "gi");
    return item[key].match(regex);
  });

  if (searchText.length < 1)
    returnedArr = cachedArr;

  return returnedArr;
}
