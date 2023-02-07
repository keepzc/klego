<template>
  <div class="create-component-list">
    <div class="component-item" v-for="(item, index) in list" :key="index" @click="onItemClick(item)">
      <l-text v-bind="item" />
    </div>
  </div>
  <styled-uploader @success="onImageUploaded"></styled-uploader>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { message } from 'ant-design-vue'
import { v4 as uuidv4 } from 'uuid'
import { ComponentData } from '../store/editor'
import StyledUploader from '../components/StyledUploader.vue'
import { imageDefaultProps, TextComponentProps } from 'kpzc-lego-components'
import { RespUploadData } from '../store/respTypes'
import { getImageDimensions } from '../helper'
export default defineComponent({
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  components: {
    StyledUploader
  },
  emits: ['on-item-click'],
  name: 'components-list',
  setup(props, context) {
    const onItemClick = (props: TextComponentProps) => {
      const componentData: ComponentData = {
        id: uuidv4(),
        name: 'l-text',
        props
      }
      context.emit('on-item-click', componentData)
    }

    const onImageUploaded = (data: { resp: RespUploadData; file: File }) => {
      const { resp, file } = data
      console.log(file)
      const componentData: ComponentData = {
        name: 'l-image',
        id: uuidv4(),
        props: {
          ...imageDefaultProps
        }
      }
      message.success('上传成功')
      componentData.props.src = resp.data.urls[0]
      getImageDimensions(file).then(({ width }) => {
        console.log(width)
        const maxWidth = 373
        componentData.props.width = ((width > maxWidth) ? maxWidth : width) + 'px'
        context.emit('on-item-click', componentData)
      })
    }
    return {
      onItemClick,
      onImageUploaded
    }
  }
})
</script>

<style>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}

/* .component-item>* {
  position: static !important;
} */
</style>
