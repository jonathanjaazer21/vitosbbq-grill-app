import React, { useEffect, useState } from "react"
import { Upload, Modal } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useGetUploads } from "./useGetUploads"
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
function UploadFiles({ id, modifiedData = () => {} }) {
  const [removedPaths, setRemovedPaths] = useState([])
  const { fileURLs, loadUploads } = useGetUploads()
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  })

  useEffect(() => {
    if (fileURLs.length > 0) {
      const _fileList = []
      let count = 0
      for (const { url, path } of fileURLs) {
        const pathSplit = path.split("/")
        const pathName = pathSplit[pathSplit.length - 1]
        count = count - 1
        _fileList.push({
          uid: count,
          name: pathName,
          status: "done",
          url,
          path,
        })
      }
      setState({ ...state, fileList: _fileList })
    }
  }, [fileURLs])

  useEffect(() => {
    modifiedData(state?.fileList, removedPaths)
  }, [removedPaths, state])

  const handleCancel = () => {
    setState({ ...state, previewVisible: false })
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setState({
      ...state,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    })
  }

  const handleChange = ({ fileList = [] }) => {
    setState({ ...state, fileList: fileList })
  }

  const handleRemove = (data) => {
    if (!isNaN(data?.uid)) {
      const _paths = [...removedPaths]
      _paths.push(data?.path)
      setRemovedPaths(_paths)
    }
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  useEffect(() => {
    loadUploads(id)
  }, [id])

  return (
    <>
      <Upload
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={state?.fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {state?.fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={state?.previewVisible}
        title={state?.previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{ width: "100%" }}
          src={state?.previewImage}
        />
      </Modal>
    </>
  )
}

export default UploadFiles
