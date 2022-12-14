<template>
  <div class="file-upload">
    <div class="upload-area" :class="{ 'is-dragover': drag && isDragOver }" v-on="events">
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <slot v-else-if="lastFileData && lastFileData.loaded" name="uploaded" :uploadedData="lastFileData.data">
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input ref="fileInput" type="file" :style="{ display: 'none' }" @change="handleFileChange">
    <ul :class="`upload-list upload-list-${listType}`" v-if="showUploadList">
      <li :class="`upload-file upload-${file.status}`" v-for="file in filesList" :key="file.uid">
        <img v-if="file.url && listType === 'picture'" class="upload-list-thumbnail" :src="file.url" :alt="file.name">
        <span class="file-icon" v-if="file.status === 'loading'">
          <LoadingOutlined />
        </span>
        <span class="file-icon" v-else>
          <FileOutlined />
        </span>
        <span class="filename">{{ file.name }}</span>
        <span class="delete-icon" @click="removeFile(file.uid)">
          <DeleteOutlined />
        </span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed, PropType } from 'vue'
import { DeleteOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons-vue'
import axios from 'axios'
import { last } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type FileListType = 'picture' | 'text'
type CheckUpload = (file: File) => boolean | Promise<File>
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
  resp?: any;
  url?: string;
}
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>
    },
    drag: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String as PropType<FileListType>,
      default: 'text'
    },
    showUploadList: {
      type: Boolean,
      default: true
    }
  },
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined
  },
  emits: ['success', 'error'],
  setup(props, { emit }) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const filesList = ref<UploadFile[]>([])
    const fileStatus = ref<UploadStatus>('ready')
    const trggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const isDragOver = ref(false)
    const isUploading = computed(() => {
      return filesList.value.some(file => file.status === 'loading')
    })
    const lastFileData = computed(() => {
      const lastFile = last(filesList.value)
      if (lastFile) {
        return {
          loaded: lastFile.status === 'success',
          data: lastFile.resp
        }
      }
      return false
    })
    const postFile = (readyFile: UploadFile) => {
      const formData = new FormData()
      formData.append(readyFile.name, readyFile.raw)
      readyFile.status = 'loading'
      axios.post(props.action, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(resp => {
        console.log(resp)
        readyFile.status = 'success'
        readyFile.resp = resp.data
        emit('success', { resp: resp.data, file: readyFile, list: filesList.value })
      }).catch((e: any) => {
        readyFile.status = 'error'
        emit('error', { error: e, file: readyFile, list: filesList.value })

      }).finally(() => {
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      })
    }
    const addFileToList = (uploadedFile: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        name: uploadedFile.name,
        size: uploadedFile.size,
        raw: uploadedFile,
        status: 'ready'
      })
      if (props.listType === 'picture') {
        //上传图片本地预览
        try {
          //1. 同步直接返回 当前文件本地内存的url，存在当前document 需要手动执行revokeObjectURL()删除
          fileObj.url = URL.createObjectURL(uploadedFile)
        } catch (e) {
          console.error(e)
        }
        //2.异步监听load方法 返回base64  依靠js垃圾回收机制处理回收
        // const fileReader = new FileReader()
        // fileReader.readAsDataURL(uploadedFile)
        // fileReader.addEventListener('load', () => {
        //   fileObj.url = fileReader.result as string
        // })
      }
      filesList.value.push(fileObj)
      if (props.autoUpload) {
        postFile(fileObj)
      }
    }
    const beforeUploadCheck = (files: null | FileList) => {
      if (files) {
        const uploadedFile = files[0]
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile)
          if (result && result instanceof Promise) {
            result.then(processedFile => {
              if (processedFile instanceof File) {
                addFileToList(processedFile)
              } else {
                throw new Error('beforeUpload Promise should return File object')
              }
            }).catch(e => {
              console.error(e)
            })
          } else if (result === true) {
            addFileToList(uploadedFile)
          }
        } else {
          addFileToList(uploadedFile)
        }

      }
    }
    //手动循环filesList上传文件
    const uploadFiles = () => {
      filesList.value.filter(file => file.status === 'ready').forEach(readyFile => postFile(readyFile))
    }
    let events: { [key: string]: (e: any) => void } = {
      'click': trggerUpload
    }
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      beforeUploadCheck(files)
    }
    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault()
      isDragOver.value = over
    }
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      isDragOver.value = false
      if (e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files)
      }
    }
    if (props.drag) {
      events = {
        ...events,
        'dragover': (e: DragEvent) => { handleDrag(e, true) },
        'dragleave': (e: DragEvent) => { handleDrag(e, false) },
        'drop': handleDrop
      }
    }
    const removeFile = (id: string) => {
      filesList.value = filesList.value.filter(item => item.uid !== id)
    }
    return {
      fileInput,
      isUploading,
      trggerUpload,
      fileStatus,
      handleFileChange,
      filesList,
      removeFile,
      lastFileData,
      isDragOver,
      events,
      uploadFiles
    }
  }
})
</script>
<style lang="scss">
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    transition: all .5s cubic-bezier(.55, 0, .1, 1);
    font-size: 14px;
    line-height: 1.8;
    margin-top: 5px;
    box-sizing: border-box;
    border-radius: 4px;
    min-width: 200px;
    max-width: 400px;
    position: relative;

    .upload-list-thumbnail {
      width: 100px;
      height: 100px;
      padding: 5px;
    }

    &:first-child {
      margin-top: 10px;
    }

    .file-icon {
      svg {
        margin-right: 5px;
        color: rgba(0, 0, 0, 0.45);
      }
    }

    .filename {
      margin-left: 5px;
      margin-right: 40px;
    }

    &.upload-error {
      color: #f5222d;

      svg {
        color: #f5222d;
      }

      .file-status {
        display: block;
        position: absolute;
        right: 5px;
        top: 0;
        line-height: inherit;
      }
    }

    &.upload-success {
      color: green;
    }

    .delete-icon {
      display: none;
      position: absolute;
      right: 7px;
      top: 0;
      line-height: inherit;
      cursor: pointer;
    }

    &:hover {
      background-color: #efefef;

      .file-status {
        display: none;
      }

      .delete-icon {
        display: block;
      }
    }
  }
}
</style>
