<template>
    <div class="image-processer">
        <div class="image-preview" :style="{ backgroundImage: backgroundUrl }">

        </div>
        <div class="image-process">
            <StyledUploader @sucess="handleFileUploaded"></StyledUploader>
            <a-button v-if="showDelete" type="danger" @click="handleDelete">
                <template v-slot:icon>
                    <DeleteOutlined />
                </template>删除图片
            </a-button>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { message } from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import StyledUploader from './StyledUploader.vue'
import { UploadResp } from '../extraType'
export default defineComponent({
    props: {
        value: {
            type: String,
            required: true
        },
        showDelete: {
            type: Boolean,
            default: false
        }
    },
    components: {
        StyledUploader,
        DeleteOutlined
    },
    emits: ['change', 'uploaded'],
    setup(props, context) {
        const backgroundUrl = computed(() => `url(${props.value})`)
        const handleDelete = () => {
            context.emit('change', '')
        }
        const handleFileUploaded = (data: { resp: UploadResp; file: File }) => {
            const { resp } = data
            message.success('上传成功')
            context.emit('change', resp.data.url)
            context.emit('uploaded', data)
        }
        return {
            backgroundUrl,
            handleDelete,
            handleFileUploaded
        }
    }
})
</script>

<style>
.image-processer {
    display: flex;
    justify-content: space-between;
}

.image-preview {
    width: 150px;
    height: 84px;
    border: 1px dashed #e6ebed;
    background: no-repeat 50%/contain;
}

.image-process {
    padding: 5px 0;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>