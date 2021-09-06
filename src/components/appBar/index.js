import React, { useState } from "react"
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai"
import { IoMdClose } from "react-icons/io"
import {
  Item,
  Wrapper,
  Menu,
  Link,
  ItemMobileView,
  User,
  UserProfileLink,
} from "./appBarStyles"
import { auth } from "services/firebase"
import {
  selectUserSlice,
  clearAccountInfo,
} from "containers/0.login/loginSlice"
import UserInfoCard from "./UserInfoCard"
import { useDispatch, useSelector } from "react-redux"
import { selectSideNav } from "components/sideNav/sideNavSlice"
import { useHistory } from "react-router-dom"
import { update } from "services"

function AppBar({ isToggled, toggle }) {
  const history = useHistory()
  const dispatch = useDispatch()
  const sideNavSlice = useSelector(selectSideNav)
  const user = useSelector(selectUserSlice)
  const [viewProfile, setViewProfile] = useState(false)
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(clearAccountInfo())
        history.push("/")
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <>
      <Wrapper isToggled={isToggled}>
        <Link onClick={toggle} isToggled={isToggled}>
          {isToggled ? (
            <AiOutlineMenuFold size={25} />
          ) : (
            <AiOutlineMenuUnfold size={25} />
          )}
        </Link>
        <Menu>
          <Item isToggled={isToggled}>Home</Item>
          <Item isToggled={isToggled}>/</Item>
          <Item isToggled={isToggled}>{sideNavSlice.selectedMenu[0]}</Item>
          <Item isToggled={isToggled}>/</Item>
          <Item isToggled={isToggled} isActive>
            {sideNavSlice.selectedMenu[1]}
          </Item>
          <ItemMobileView>{sideNavSlice.selectedMenu[1]}</ItemMobileView>
        </Menu>
        <div style={{ position: "relative" }}>
          <UserProfileLink
            onClick={(e) => {
              setViewProfile(true)
            }}
          >
            <User />
          </UserProfileLink>
          {/* <div
          style={{
            padding: "2rem",
            display: viewProfile ? "block" : "none",
            zIndex: "999",
            position: "absolute",
            backgroundColor: "white",
            right: 0,
            top: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              cursor: "pointer",
            }}
            onClick={() => setViewProfile(false)}
          >
            <IoMdClose />
          </div>
          <img src={user.photoURL} />
          <h4>{user.displayName}</h4>
          <span>{user.email}</span>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogout()
              // history.push("/")
            }}
          >
            Logout
          </button>
        </div> */}
        </div>
      </Wrapper>
      {viewProfile && (
        <UserInfoCard
          close={() => setViewProfile(false)}
          name={user.displayName}
          email={user.email}
          branch={user.branches.length > 0 ? user.branches[0] : "None"}
          logout={(e) => {
            e.preventDefault()
            handleLogout()
            // history.push("/")
          }}
        />
      )}
    </>
  )
}

export default AppBar
