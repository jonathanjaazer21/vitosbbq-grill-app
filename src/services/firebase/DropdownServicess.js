import Commands from "./base"
const collectionName = "dropdowns"
export default class ScheduleServicess extends Commands {
  constructor(args) {
    super({ ...args, _collectionName: collectionName })
  }
}
