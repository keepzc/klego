<template>
    <div class="image-processer">
        <a-modal title="裁剪图片" v-model:visible="showModal" @ok="handleOk" @cancel="showModal = false" okText="确认"
            cancelText="取消">
            <div class="image-cropper">
                <img :src="baseImageUrl" id="processed-image" ref="cropperImg" />
            </div>
        </a-modal>
        <div class="image-preview" :style="{ backgroundImage: backgroundUrl }">

        </div>
        <div class="image-process">
            <StyledUploader @sucess="handleFileUploaded"></StyledUploader>
            <a-button @click="showModal = true">
                <template v-slot:icon>
                    <ScissorOutlined />
                </template>裁剪图片
            </a-button>
            <a-button v-if="showDelete" type="danger" @click="handleDelete">
                <template v-slot:icon>
                    <DeleteOutlined />
                </template>删除图片
            </a-button>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import axios from 'axios'
import Cropper from 'cropperjs'
import { DeleteOutlined, ScissorOutlined } from '@ant-design/icons-vue'
import StyledUploader from './StyledUploader.vue'
import { UploadResp } from '../extraType'
interface CropDataProps {
    x: number;
    y: number;
    width: number;
    height: number;
}
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
        DeleteOutlined,
        ScissorOutlined
    },
    emits: ['change', 'uploaded'],
    setup(props, context) {
        const showModal = ref(false)
        const backgroundUrl = computed(() => `url(${props.value})`)
        const baseImageUrl = computed(() => props.value.split('?')[0])
        const cropperImg = ref<null | HTMLImageElement>(null)

        let cropper: Cropper
        let cropData: CropDataProps | null = null
        watch(showModal, async (newValue) => {
            if (newValue) {
                await nextTick()
                if (cropperImg.value) {
                    cropper = new Cropper(cropperImg.value, {
                        crop(event) {
                            const { x, y, width, height } = event.detail
                            cropData = {
                                x: Math.floor(x),
                                y: Math.floor(y),
                                width: Math.floor(width),
                                height: Math.floor(height)
                            }
                        }
                    })
                }
            } else {
                if (cropper) {
                    cropper.destroy()
                }
            }
        })
        const handleDelete = () => {
            context.emit('change', '')
        }
        const handleFileUploaded = (data: { resp: UploadResp; file: File }) => {
            const { resp } = data
            message.success('上传成功')
            context.emit('change', resp.data.url)
            context.emit('uploaded', data)
        }
        const handleOk = () => {
            if (cropData) {
                const { x, y, width, height } = cropData
                const cropperUrl = baseImageUrl.value + `?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
                // 不使用阿里云 oss， 拿到截图再次上传的处理方法
                // cropper.getCroppedCanvas().toBlob((blob) => {
                //     if (blob) {
                //         const formData = new FormData()
                //         formData.append('croppedImage', blob, 'test.png')
                //         axios.post('http://123.57.138.48/api/upload/', formData, {
                //             headers: {
                //                 'Content-Type': 'multipart/form-data'
                //             }
                //         }).then(resp => {
                //             context.emit('change', resp.data.data.url)
                //             showModal.value = false
                //         })
                //     }
                // })
                context.emit('change', cropperUrl)
            }
            showModal.value = false
        }
        return {
            showModal,
            backgroundUrl,
            baseImageUrl,
            handleDelete,
            handleFileUploaded,
            handleOk,
            cropperImg
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

.image-cropper img {
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
}
</style>