import { ARRAY_OF_STRING_TYPE, DATE_TYPE, STRING_TYPE } from "Constants/types"
import { producedIncidents } from "Helpers/collectionData"
import Base from "Services/Base"

export default class IncidentReportClass {
  static COLLECTION_NAME = "schedules"

  static async getDataBySort(customSort = [], branch) {
    const data = await Base.getDataNotEqualToFieldname(
      this.COLLECTION_NAME,
      customSort.length > 0 ? [...customSort] : [this.DATE, "desc"],
      "others.Incidents",
      ""
    )
    return producedIncidents(data, branch)
  }

  static _ID = "_id"
  static DATE_AND_TIME = "dateAndTime"
  static DATE = "dateOrderPlaced"
  static ACTION_TAKEN = "actionTaken"
  static AMOUNT = "amount"
  static CLIENT_NAME = "clientName"
  static CONTACT_NO = "contactNo"
  static ON_DUTY = "onDuty"
  static ORDER_NO = "orderNo"
  static BRIEF_DESCRIPTION = "briefDescription"

  static PROPERTIES = [
    this.DATE,
    this.ORDER_NO,
    this.CLIENT_NAME,
    this.CONTACT_NO,
    this.BRIEF_DESCRIPTION,
    this.ON_DUTY,
  ]

  static LABELS = {
    [this.BRANCH_ADDRESS]: "Address",
    [this.BRANCH_NAME]: "Branch",
    [this.DATE]: "Date",
    [this.ORDER_NO]: "Order #",
    [this.CLIENT_NAME]: "Client Name",
    [this.CONTACT_NO]: "Contact No",
    [this.BRIEF_DESCRIPTION]: "Brief Description",
    [this.ON_DUTY]: "On Duty",
  }
  static TYPES = {
    [this.DATE]: DATE_TYPE,
  }
}
