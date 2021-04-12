import { useEffect, useState } from 'react'
import { addData, deleteData, getData } from 'services'
import db, { storage } from 'services/firebase'

export function useGetUploads (documentId) {
  const [fileList, setFileList] = useState([
    // {
    //   uid: 'a',
    //   name: 'xxx.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   idRef: 'asdfasdfasdf'
    // },
    // {
    //   uid: 'b',
    //   name: 'yyy.png',
    //   status: 'error'
    // }
  ])

  useEffect(() => {
    loadUploads(documentId)
  }, [documentId])

  const addUpload = async (data) => {
    const newFileListFilter = fileList.filter(file => file.status !== 'uploading')
    const newFileList = [...newFileListFilter]
    const docRefId = await addData({ collection: 'uploads', data })
    newFileList.push({ ...data, uploadId: docRefId })
    setFileList(newFileList)
  }

  const handleUpload = (file) => {
    console.log('file', file)
    const newFileList = [...fileList]
    newFileList.push({ name: file?.name, status: 'uploading', uid: file?.uid, percent: 50, url: '' })
    setFileList(newFileList)

    const uploadTask = storage.ref(`uploads/${documentId}/${file.name}`).put(file)
    uploadTask.on(
      'state_changed',
      snapshot => { },
      error => {
        console.log(error)
      },
      () => {
        storage
          .ref(`uploads/${documentId}`)
          .child(file.name)
          .getDownloadURL()
          .then(url => {
            if (url) {
              const data = { name: file?.name, url, thumbUrl: url, idRef: documentId, status: 'done', uid: file?.uid }
              addUpload(data)
            }
          })
      }
    )
  }
  const handleRemove = (file) => {
    const newFileList = fileList.filter(f => f.uploadId !== file.uploadId)
    setFileList(newFileList)
    // Create a reference to the file to delete
    const deleteTask = storage?.ref(`uploads/${file.idRef}/`).child(file.name)
    // Delete the file
    deleteTask.delete().then(() => {
      deleteData({ id: file.uploadId, collection: 'uploads' })
    }).catch((error) => {
      console.log('delete upload error occured', error)
      // Uh-oh, an error occurred!
    })
  }
  const loadUploads = async (id) => {
    db.collection('uploads')
      .where('idRef', '==', id)
      .get()
      .then((querySnapshot) => {
        const newFileList = [...fileList]
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          newFileList.push({ ...data, uploadId: doc.id })
        })
        setFileList([...newFileList])
      })
  }
  return [fileList, handleUpload, handleRemove]
}
