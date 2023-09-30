function getDate(value) {
  const date = new Date(Date.parse(value));

  function convertUTCDateToLocalDate(date) {
    let newDate = new Date(date);
    let d = newDate;
    return [
      (d.getDate() < 10 ? "0" : "") + d.getDate(),
      (d.getMonth() + 1 < 10 ? "0" : "") + (d.getMonth() + 1),
      d.getFullYear(),
    ].join(".");
  }

  const newTime = convertUTCDateToLocalDate(date);
  return newTime;
}

export default getDate;
