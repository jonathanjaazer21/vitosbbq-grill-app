import { useHistory, useLocation } from "react-router"
import { useContext, useEffect, useState } from "react"
import { LABEL } from "Constants/pathNames"
import { UnavailableContext } from "Error/Unavailable"

// Notes: The header label of this page is dependent in the constants/pathNames file (if it doesnt exist you must create a variable first)

export default function useContentNavigator() {
  const location = useLocation()
  const [breadcrumb, setBreadcrumb] = useState([])
  const [header, setHeader] = useState("")
  useEffect(() => {
    const pathNames = handlePathNames(location.pathname)
    const _breadcrumb = []
    if (pathNames.length === 0) {
      setHeader("Home")
    }
    for (const routeName of pathNames) {
      let url = producedURL(routeName, pathNames)
      const title = LABEL[routeName] ? LABEL[routeName] : routeName
      _breadcrumb.push({
        title,
        url: url,
      })
      setHeader(title)
    }
    setBreadcrumb(_breadcrumb)
  }, [location.pathname])

  // this function will split tha location pathName url and produced an array of strings
  const handlePathNames = (pathUrl) => {
    const pathNameSplit = pathUrl.split("/")
    // to clear empty strings inside array
    const pathNames = pathNameSplit.filter((e) => e)
    return pathNames
  }
  return { header, breadcrumb }
}

// this function will produced a path url for each breadcrumb click
const producedURL = (routeName, pathNames) => {
  let url = ""
  const pathNameIndex = pathNames.indexOf(routeName)
  for (let index = 0; index <= pathNameIndex; index++) {
    url += `/${pathNames[index]}`
  }
  return url
}
