import { Button, message } from "antd"
import { sortArray } from "Helpers/sorting"
import { forEach } from "lodash"
import React, { useEffect, useState } from "react"
import PriceHistoriesClass from "Services/Classes/priceHistoriesClass"
import EditableTag from "./PriceHistoryEditableTag"

function PriceHistory({
  defaultTags = [],
  id,
  productCode,
  addHistory = () => {},
}) {
  const [initializedTags, setInitializedTags] = useState([])
  const [tags, setTags] = useState([])

  const compareTags = (_tags = [], _initializedTags = []) => {
    let tagState = false

    if (_tags.length !== _initializedTags.length) {
      tagState = true
    } else {
      for (const [index, value] of tags.entries()) {
        const num1 = Number(_initializedTags[index])
        const num2 = Number(value)
        tagState = num1 !== num2
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
      PriceHistoriesClass.setDataById(id, {
        [productCode]: sortArray(convertPricesToNumber),
      })
      message.success("Updated successfully")
    } else {
      const result = await PriceHistoriesClass.addData({
        [productCode]: sortArray(convertPricesToNumber),
      })
      if (result._id) {
        message.success("Updated successfully")
        addHistory({
          [productCode]: sortArray(convertPricesToNumber),
          _id: result._id,
        })
      }
    }
    setInitializedTags(sortArray(tags))
  }

  const tagsUsed = initializedTags.length > 0 ? initializedTags : defaultTags
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <EditableTag
        tags={tagsUsed}
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
