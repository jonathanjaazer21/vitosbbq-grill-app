import { useEffect, useState } from "react"
import {
  ref,
  getStorage,
  listAll,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "Services/firebase"
const storage = getStorage()

export function useGetUploads(documentId) {
  const [fileURLs, setFileURLs] = useState([])

  useEffect(() => {
    loadUploads(documentId)
  }, [documentId])

  const addUpload = async (data) => {
    // const newFileListFilter = fileList.filter(file => file.status !== 'uploading')
    // const newFileList = [...newFileListFilter]
    // const docRefId = await addData({ collection: 'uploads', data })
    // newFileList.push({ ...data, uploadId: docRefId })
    // setFileList(newFileList)
  }

  const handleUpload = async (fileList = [], id = "") => {
    if (typeof id !== "undefined" || id) {
      for (const obj of fileList) {
        if (isNaN(obj?.uid)) {
          const fileRef = ref(storage, `uploads/${id}/${obj.name}`)
          console.log("fileRef", fileRef)
          await uploadBytes(fileRef, obj?.originFileObj)
        }
      }
    }
    // console.log('file', file)
    // const newFileList = [...fileList]
    // newFileList.push({ name: file?.name, status: 'uploading', uid: file?.uid, percent: 50, url: '' })
    // setFileList(newFileList)
    // const uploadTask = storage.ref(`uploads/${documentId}/${file.name}`).put(file)
    // uploadTask.on(
    //   'state_changed',
    //   snapshot => { },
    //   error => {
    //     console.log(error)
    //   },
    //   () => {
    //     storage
    //       .ref(`uploads/${documentId}`)
    //       .child(file.name)
    //       .getDownloadURL()
    //       .then(url => {
    //         if (url) {
    //           const data = { name: file?.name, url, thumbUrl: url, idRef: documentId, status: 'done', uid: file?.uid }
    //           addUpload(data)
    //         }
    //       })
    //   }
    // )
  }
  const handleRemove = (fileList = []) => {
    for (const path of fileList) {
      const fileRef = ref(storage, path)

      deleteObject(fileRef)
        .then(() => {
          // File deleted successfully
          console.log("Successfully removed file: ", path)
        })
        .catch((error) => {
          console.log(`Removed failed ${path}: `, error)
          // Uh-oh, an error occurred!
        })
    }
  }

  const loadUploads = async (id) => {
    const fileRef = ref(storage, `uploads/${id}`)
    listAll(fileRef)
      .then(async (res) => {
        res.prefixes.forEach((folderRef) => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
        })
        const fileList = []
        for (const itemRef of res?.items) {
          const { _location } = itemRef
          const imageRef = ref(storage, _location?.path)
          const file = await getDownloadURL(imageRef)
          fileList.push({ url: file, path: _location?.path })
        }
        console.log("fileList", fileList)
        setFileURLs(fileList)
      })
      .catch((error) => {
        console.log("file list: ", error)
        setFileURLs([])
        // Uh-oh, an error occurred!
      })
  }
  return { fileURLs, handleUpload, handleRemove, loadUploads }
}
