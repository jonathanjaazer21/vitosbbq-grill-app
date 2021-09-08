import moment from "moment"

export default function checkDate(d) {
  const date = moment(d)
  return date.isValid()
}
