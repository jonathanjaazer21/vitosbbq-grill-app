// import { menuData } from "Components/Features/Sidenav/hook"

import menuData from "Components/Features/Sidenav/menuData"

export default function () {
  const menuList = []
  for (const obj of menuData([])) {
    menuList.push(obj.title)
    for (const subObj of obj.subMenu) {
      menuList.push(subObj.title)
    }
  }
  return menuList
}
