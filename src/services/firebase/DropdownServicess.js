import Commands from "./base"
import db from "services/firebase"
const collectionName = "dropdowns"
export default class ScheduleServicess extends Commands {
  constructor(args) {
    super({ ...args, _collectionName: collectionName })
  }
}
