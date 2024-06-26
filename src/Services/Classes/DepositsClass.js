import {
  ARRAY_OF_OBJECT_TYPE,
  ARRAY_OF_STRING_TYPE,
  STRING_TYPE,
} from "Constants/types"
import db, { runTransaction, doc, writeBatch } from "../firebase"
import Base from "Services/Base"
import { formatDateFromDatabase } from "Helpers/dateFormat"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"

export default class DepositsClass {
  static COLLECTION_NAME = "deposits"

  static getDataByDate(dates, fieldname, branch) {
    return Base.getDataByDate(this.COLLECTION_NAME, dates, fieldname, branch)
  }

  static getData() {
    return Base.getData(this.COLLECTION_NAME)
  }
  static getDataById(id) {
    return Base.getDataById(this.COLLECTION_NAME, id)
  }

  static updateDataById(id, data) {
    return Base.updateDataById(this.COLLECTION_NAME, id, data)
  }

  static getDataBySort(customSort = []) {
    return Base.getDataBySort(
      this.COLLECTION_NAME,
      customSort.length > 0 ? [...customSort] : [this.NO, "asc"]
    )
  }

  static getDataByFieldName(fieldname, value) {
    return Base.getDataByFieldname(this.COLLECTION_NAME, fieldname, value)
  }

  static getDataByFieldNameWithBranch(fieldname, value, branch) {
    return Base.getDataByFieldnameWithBranch(
      this.COLLECTION_NAME,
      fieldname,
      value,
      branch
    )
  }

  static addData(data) {
    return Base.addData(this.COLLECTION_NAME, data)
  }

  static setData(id, data) {
    return Base.setData(this.COLLECTION_NAME, id, data)
  }

  // this is a specialize function
  static async getSpecificDate(branch) {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where("paymentList.0.refNo", "==", "111"),
      where("branch", "==", branch)
    )
    const querySnapshot = await getDocs(q)
    // use .metadata.fromCache of firebase instead since try catch is not working here
    if (querySnapshot.metadata.fromCache) {
      throw new Error("UNAVAILABLE")
    }
    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), _id: doc.id })
    })
    return data
  }

  static async handleTransaction(data = []) {
    const batch = writeBatch(db)

    // Set the value of 'NYC'
    data.forEach((obj) => {
      const document = doc(db, "schedules", obj._id)
      const _data = [
        {
          amount: obj?.amountPaid,
          date: obj?.datePayment,
          orNo: obj?.orNo || "",
          paymentNotes: obj?.paymentNotes || "",
          refNo: obj?.refNo || "",
          soaNumber: obj?.soaNumber || "",
          modePayment: "Cash",
          source: "Cash",
          accountNumber: "BDO / 981",
        },
      ]
      console.log("objbatch", { partials: [..._data] })

      batch.update(document, { partials: [..._data], cashForDeposit: false })
    })

    // Commit the batch
    try {
      const result = await batch.commit()
    } catch {}
    // Create a reference to the SF doc.
    // const sfDocRef = doc(db, SchedulersClass.COLLECTION_NAME, id)

    // try {
    //   const schedRef = await runTransaction(db, async (transaction) => {
    //     const sfDoc = await transaction.get(sfDocRef)
    //     if (!sfDoc.exists()) {
    //       throw "Document does not exist!"
    //     }

    //     if (newPop <= 1000000) {
    //       transaction.update(sfDocRef, { population: newPop })
    //       return newPop
    //     } else {
    //       return Promise.reject("Sorry! Population is too big")
    //     }
    //   })

    //   console.log("Population increased to ", newPopulation)
    // } catch (e) {
    //   // This will be a "population is too big" error.
    //   console.error(e)
    // }
  }
  static _ID = "_id"
  static DATE_PAID_STRING = "datePaidString" // this is a string string format date of dateDeposit
  static DATE_PAYMENT = "datePayment"
  static DATE_DEPOSIT = "dateDeposit"
  static TOTAL_DEPOSIT = "totalDeposit"
  static MODE_PAYMENT = "modePayment"
  static SOURCE = "source"
  static ACCOUNT_NUMBER = "accountNumber"
  static PAYMENT_LIST = "paymentList"
  static BRANCH = "branch"

  static PROPERTIES = [
    this._ID,
    this.DATE_DEPOSIT,
    this.DATE_PAYMENT,
    this.MODE_PAYMENT,
    this.SOURCE,
    this.ACCOUNT_NUMBER,
    this.TOTAL_DEPOSIT,
    this.PAYMENT_LIST,
    this.BRANCH,
  ]

  static LABELS = {
    [this.DATE_DEPOSIT]: "Date Deposit",
    [this.TOTAL_DEPOSIT]: "Total Deposits",
    [this.MODE_PAYMENT]: "Mode",
    [this.SOURCE]: "Source",
    [this.ACCOUNT_NUMBER]: "Acct No",
    [this.PAYMENT_LIST]: "Payment List",
    [this.BRANCH]: "Branch",
  }
  static TYPES = {
    [this.DATE_DEPOSIT]: STRING_TYPE,
    [this.TOTAL_DEPOSIT]: STRING_TYPE,
    [this.MODE_PAYMENT]: STRING_TYPE,
    [this.SOURCE]: STRING_TYPE,
    [this.ACCOUNT_NUMBER]: STRING_TYPE,
    [this.PAYMENT_LIST]: ARRAY_OF_OBJECT_TYPE,
    [this.BRANCH]: STRING_TYPE,
  }
}
