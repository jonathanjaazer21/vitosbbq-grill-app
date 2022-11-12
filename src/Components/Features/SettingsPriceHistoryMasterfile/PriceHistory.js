import { Button } from "antd"
import { forEach } from "lodash"
import React, { useEffect, useState } from "react"
import EditableTag from "./PriceHistoryEditableTag"

function PriceHistory({ defaultTags = [], id }) {
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

  const handleSave = () => {
    setInitializedTags(tags)
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
              setInitializedTags([...defaultTags])
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
