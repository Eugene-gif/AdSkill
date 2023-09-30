import moment from "moment";

export function convertToTimestamp(date) {
  const startTimestamp = moment(date.from, "YYYY/MM/DD")
    .startOf("day")
    .unix();

  const endTimestamp = moment(date.to, "YYYY/MM/DD")
    .endOf("day")
    .unix();

  return {
    from: startTimestamp,
    to: endTimestamp,
  };
}
