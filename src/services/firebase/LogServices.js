import Commands from "./base"
const collectionName = "logs"
export default class ScheduleServicess extends Commands {
  constructor(args) {
    super({ ...args, _collectionName: collectionName })
  }
}
