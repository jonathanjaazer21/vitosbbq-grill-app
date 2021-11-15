import { Layout, Breadcrumb } from "antd"
import { HomeFilled } from "@ant-design/icons"
import Title from "antd/lib/typography/Title"
import React from "react"
import useContentNavigator from "./hook"
import { Link } from "react-router-dom"
import UserProfile from "../UserProfile"
import styled from "styled-components"
import SidenavMobile from "../Sidenav/SidenavMobile"
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint"
const { Header, Content } = Layout

const defaultPadding = "1rem 1rem"
function ContentNavigator({ children }) {
  const { xs } = useBreakpoint()
  const { header = "", breadcrumb = [] } = useContentNavigator()
  return (
    <Layout>
      <StyledHeader>
        {xs && <SidenavMobile />}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            paddingTop: ".5rem",
          }}
        >
          <Title level={4}>{header}</Title>
        </div>
        <UserProfile />
      </StyledHeader>
      <Breadcrumb style={{ margin: defaultPadding }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeFilled />
          </Link>
        </Breadcrumb.Item>
        {breadcrumb.map((breadcrumb, index) => {
          const lastIndex = breadcrumb.length - 1
          return (
            <Breadcrumb.Item key={index}>
              {lastIndex === index ? (
                breadcrumb.title
              ) : (
                <Link to={`${breadcrumb.url}`}>{breadcrumb.title}</Link>
              )}
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
      <Content
        style={{
          padding: "0rem 1rem",
        }}
      >
        {children}
      </Content>
    </Layout>
  )
}

const StyledHeader = styled(Header)`
  background-color: #d6e4ff;
  padding: 0rem 1rem;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
`
export default ContentNavigator
