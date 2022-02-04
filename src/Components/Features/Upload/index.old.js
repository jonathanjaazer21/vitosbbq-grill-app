import React from 'react'
import { Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useGetUploads } from './useGetUploads'
import './upload.css'
export function Uploads ({ id }) {
  const [fileList, handleUpload, handleRemove] = useGetUploads(id)
  return (
    <>
      <Upload
        action={handleUpload}
        listType='picture'
        fileList={[...fileList]}
        className='upload-list-inline'
        onRemove={handleRemove}
      >
        <Button type='primary' danger icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </>
  )
}
