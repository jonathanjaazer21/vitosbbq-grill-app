import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { Space, Switch } from "antd"
import CustomTitle from "Components/Commons/CustomTitle"
import MainButton from "Components/Commons/MainButton"
import {
  ARRAY_OF_OBJECT_TYPE,
  ARRAY_OF_STRING_TYPE,
  BOOLEAN_TYPE,
  STRING_TYPE,
} from "Constants/types"
import EditableTagGroup from "../EditableTagGroup"
import useQuery from "Hooks/useQuery"
import useGetDocumentById from "Hooks/useGetDocumentById"
import useModifiedCount from "./useModifiedCount"
import CustomPopConfirm from "Components/Commons/CustomPopConfirm"
import StringField from "./StringField"
import StringFieldArray from "./StringFieldArray"
import BooleanField from "./BooleanField"
import UsersClass from "Services/Classes/UsersClass"
function FormHandlerAdd({ ServiceClass, back, formSave = () => {} }) {
  const [defaultData, setDefaultData] = useState()
  const [properties, setProperties] = useState([])
  const [modifiedData, setModifiedData] = useState({})
  useEffect(() => {
    if (ServiceClass.PROPERTIES.length > 0) {
      const newProperties = ServiceClass.PROPERTIES.filter(
        (field) => field !== "_id"
      )

      if (ServiceClass.COLLECTION_NAME === UsersClass.COLLECTION_NAME) {
        // includes the _id property if it is user class
        newProperties.splice(0, 0, ServiceClass._ID)
      }
      setProperties(newProperties)

      const _defaultData = {} // set some default value to prevent error when the fields do not have an input
      for (const key of newProperties) {
        switch (ServiceClass.TYPES[key]) {
          case STRING_TYPE:
            _defaultData[key] = ""
            break
          case ARRAY_OF_STRING_TYPE:
            _defaultData[key] = []
            break
          case ARRAY_OF_OBJECT_TYPE:
            _defaultData[key] = []
            break
          case BOOLEAN_TYPE:
            _defaultData[key] = true
            break
          default:
            _defaultData[key] = ""
        }
      }
      setDefaultData(_defaultData)
    }
  }, [ServiceClass])

  const handleModification = (value, name) => {
    const _modifiedData = { ...modifiedData }
    _modifiedData[name] = value
    setModifiedData(_modifiedData)
  }

  const handleSave = async () => {
    if (ServiceClass.COLLECTION_NAME === UsersClass.COLLECTION_NAME) {
      await ServiceClass.setData(modifiedData[ServiceClass._ID], {
        ...defaultData,
        ...modifiedData,
      })
      back()
      return
    }
    // if the collection is not equal to user this function will be trigger
    await ServiceClass.addData({
      ...defaultData,
      ...modifiedData,
    })
    back()
  }
  return (
    <>
      <StyledContainer>
        <Header back={back} modifiedData={modifiedData} />
        <StyledFormContainer>
          <StyledForm direction="vertical">
            {properties.map((name) => {
              switch (ServiceClass.TYPES[name]) {
                case STRING_TYPE:
                  return (
                    <StringField
                      ServiceClass={ServiceClass}
                      collectionData={defaultData}
                      name={name}
                      handleModification={handleModification}
                    />
                  )
                case ARRAY_OF_STRING_TYPE:
                  return (
                    <StringFieldArray
                      ServiceClass={ServiceClass}
                      collectionData={defaultData}
                      name={name}
                      handleModification={handleModification}
                    />
                  )
                case ARRAY_OF_OBJECT_TYPE:
                  return <div>I am array of object</div>
                case BOOLEAN_TYPE:
                  return (
                    <BooleanField
                      ServiceClass={ServiceClass}
                      collectionData={defaultData}
                      name={name}
                      handleModification={handleModification}
                    />
                  )
              }
              return (
                <StringField
                  ServiceClass={ServiceClass}
                  collectionData={defaultData}
                  name={name}
                  handleModification={handleModification}
                />
              )
            })}
            <ActionButtons
              modifiedData={modifiedData}
              back={back}
              handleSave={handleSave}
            />
          </StyledForm>
        </StyledFormContainer>
      </StyledContainer>
    </>
  )
}

const Header = (props) => {
  const modifiedCount = useModifiedCount(props)
  return (
    <StyledHeader>
      <CustomPopConfirm
        Component={MainButton}
        componentProps={{ Icon: <ArrowLeftOutlined />, shape: "circle" }}
        onConfirm={props.back}
        count={modifiedCount}
      />
      Form Data
    </StyledHeader>
  )
}

const ActionButtons = (props) => {
  const modifiedCount = useModifiedCount(props)
  return (
    <StyledActionContainer>
      <CustomPopConfirm
        Component={MainButton}
        componentProps={{
          label: "Cancel",
          danger: true,
          disabled: modifiedCount > 0 ? false : true,
        }}
        onConfirm={props.back}
        count={modifiedCount}
      />
      <MainButton
        label="Save"
        disabled={modifiedCount > 0 ? false : true}
        onClick={props.handleSave}
      />
    </StyledActionContainer>
  )
}

const StyledContainer = styled.div`
  display: grid;
  grid-template-rows: 3rem 1fr;
  grid-template-columns: 1fr;
  justify-content: flex-start;
  position: absolute;
  top: 0;
  height: 85vh;
  width: 100%;
  z-index: 1000;
  background-color: #eee;
`

const StyledHeader = styled(Space)`
  display: flex;
`

const StyledFormContainer = styled.div`
  justify-content: center;
  display: flex;
`
const StyledForm = styled(Space)`
  display: flex;
  max-width: 375px;
  width: 100%;
`

const StyledActionContainer = styled(Space)`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`
export default FormHandlerAdd
