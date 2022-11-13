import { Button, message } from "antd"
import { sortArray } from "Helpers/sorting"
import { forEach } from "lodash"
import React, { useEffect, useState } from "react"
import PriceHistoriesClass from "Services/Classes/priceHistoriesClass"
import SpecificPriceHistoriesClass from "Services/Classes/specificPriceHistoriesClass"
import EditableTag from "./PriceHistoryEditableTag"

function PriceHistory({
  defaultTags = [],
  id,
  productCode,
  orderVia, //optional for partnerMerchant orderVia's and Zap only
  addHistory = () => {},
}) {
  const [initializedTags, setInitializedTags] = useState([])
  const [tags, setTags] = useState([])
  useEffect(() => {
    setInitializedTags(defaultTags)
  }, [defaultTags, orderVia])

  const compareTags = (_tags = [], _initializedTags = []) => {
    let tagState = false
    if (_tags.length !== _initializedTags.length) {
      tagState = true
    } else {
      for (const value of tags) {
        const num2 = Number(value)
        if (!_initializedTags.includes(num2)) {
          tagState = !_initializedTags.includes(num2)
        }
      }
    }

    if (tags.length === 0) {
      tagState = false
    }
    return tagState
  }

  const handleSave = async () => {
    const convertPricesToNumber = tags.map((price) => Number(price))
    if (productCode && id) {
      if (orderVia) {
        SpecificPriceHistoriesClass.setDataById(id, {
          [productCode]: sortArray(convertPricesToNumber),
        })
      } else {
        PriceHistoriesClass.setDataById(id, {
          [productCode]: sortArray(convertPricesToNumber),
        })
      }
      console.log("id", id)
      message.success("Updated successfully")
    } else {
      let withOrderVia = orderVia ? { orderVia } : {}
      if (orderVia) {
        const result = await SpecificPriceHistoriesClass.addData({
          [productCode]: sortArray(convertPricesToNumber),
          ...withOrderVia,
        })
        if (result._id) {
          console.log("id", result._id)
          message.success("Updated successfully")
          addHistory({
            [productCode]: sortArray(convertPricesToNumber),
            _id: result._id,
            ...withOrderVia,
          })
        }
      } else {
        const result = await PriceHistoriesClass.addData({
          [productCode]: sortArray(convertPricesToNumber),
          ...withOrderVia,
        })
        if (result._id) {
          console.log("id", result._id)
          message.success("Updated successfully")
          addHistory({
            [productCode]: sortArray(convertPricesToNumber),
            _id: result._id,
            ...withOrderVia,
          })
        }
      }
    }
    setInitializedTags(sortArray(tags))
  }

  const tagsUsed = initializedTags.length > 0 ? initializedTags : defaultTags
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <EditableTag
        tags={tagsUsed}
        orderVia={orderVia} // this is optional partnermerchant and zap only feature for useEffects
        exposeData={(data) => {
          setTags(data)
        }}
        inputType="number"
      />
      {compareTags(tags, tagsUsed) && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            padding: ".5rem .5rem",
          }}
        >
          <Button
            size="small"
            onClick={() => {
              setInitializedTags([])
              setInitializedTags([...tagsUsed])
            }}
          >
            Cancel
          </Button>
          <Button size="small" type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      )}
    </div>
  )
}

export default PriceHistory
