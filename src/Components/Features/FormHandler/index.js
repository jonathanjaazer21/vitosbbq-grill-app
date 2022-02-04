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
import ObjectFieldArray from "./ObjectFieldArray"
function FormHandler({ ServiceClass, back, formSave = () => {} }) {
  const query = useQuery()
  const id = query.get("id")
  const [collectionData] = useGetDocumentById(ServiceClass, id)
  const [properties, setProperties] = useState([])
  const [modifiedData, setModifiedData] = useState({})
  useEffect(() => {
    console.log(ServiceClass.COLLECTION_NAME)
    if (ServiceClass.PROPERTIES.length > 0) {
      const newProperties = ServiceClass.PROPERTIES.filter(
        (field) => field !== "_id"
      )
      setProperties(newProperties)
    }
  }, [ServiceClass])

  const handleModification = (value, name) => {
    const _modifiedData = { ...modifiedData }
    _modifiedData[name] = value
    setModifiedData({ ..._modifiedData })
  }

  const handleSave = async () => {
    const dataToBeSaved = { ...modifiedData }
    // remove if field is not included in the properties of a class
    for (const key in dataToBeSaved) {
      if (!properties.includes(key)) {
        delete dataToBeSaved[key]
      }
    }

    await ServiceClass.updateDataById(id, dataToBeSaved)
    formSave({ ...collectionData, ...dataToBeSaved, [ServiceClass._ID]: id })
    back()
  }

  console.log("collectionData", collectionData)
  return (
    <>
      {Object.keys(collectionData).length > 0 && (
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
                        collectionData={collectionData}
                        name={name}
                        handleModification={handleModification}
                      />
                    )
                  case ARRAY_OF_STRING_TYPE:
                    return (
                      <StringFieldArray
                        ServiceClass={ServiceClass}
                        collectionData={collectionData}
                        name={name}
                        handleModification={handleModification}
                      />
                    )
                  case ARRAY_OF_OBJECT_TYPE:
                    return (
                      <ObjectFieldArray
                        ServiceClass={ServiceClass}
                        collectionData={collectionData}
                        name={name}
                        handleModification={handleModification}
                      />
                    )
                  case BOOLEAN_TYPE:
                    return (
                      <BooleanField
                        ServiceClass={ServiceClass}
                        collectionData={collectionData}
                        name={name}
                        handleModification={handleModification}
                      />
                    )
                }
                return (
                  <StringField
                    ServiceClass={ServiceClass}
                    collectionData={collectionData}
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
      )}
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
        count={modifiedCount} // count is used for notification discard Changes
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
export default FormHandler
