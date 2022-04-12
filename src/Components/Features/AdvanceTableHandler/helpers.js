import { AMOUNT_TYPE } from "Constants/types"

export const handleTitle = (ServiceClass, key) => {
  if (typeof ServiceClass?.LABELS === "undefined") {
    return key
  } else {
    const title = ServiceClass?.LABELS[key] ? ServiceClass?.LABELS[key] : key
    return title
  }
}

export const handleAlignment = (ServiceClass, key, defaultColumnAlign) => {
  let result = defaultColumnAlign
  if (typeof ServiceClass?.TYPES === "undefined") {
    return "left"
  }

  switch (ServiceClass.TYPES[key]) {
    case AMOUNT_TYPE:
      result = "right"
  }
  return result
}
