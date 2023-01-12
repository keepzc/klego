<template>
    <div class="publish-channel-container">
        <a-row :style="{ marginBottom: '20px' }">
            <a-col :span="8" class="left-col">
                封面图
                <img :src="page.coverImg" :alt="page.title" />
            </a-col>
            <a-col :span="16" class="right-col">
                <a-row>
                    <a-col :span="6">
                        <img src="http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png"
                            :alt="page.title" />
                    </a-col>
                    <a-col :span="18" class="left-gap">
                        <h4>{{ page.title }}</h4>
                        <p>{{ page.desc }}</p>
                    </a-col>
                </a-row>
                <a-tabs type="card" :style="{ marginTop: '20px' }">
                    <a-tab-pane key="channels" tab="发布为作品">
                        <a-row v-for="channel in channels" :key="channel.id" class="channel-item">
                            <a-col :span="6">
                                <canvas class="barcode-container" :id="`channel-barcode-${channel.id}`"></canvas>
                            </a-col>
                            <a-col :span="18" class="left-gap">
                                <h4>{{ channel.name }}</h4>
                                <a-row>
                                    <a-col :span="18">
                                        <a-input :value="generateChannelUrl(channel.id)" />
                                    </a-col>
                                    <a-col :span="6">
                                        <a-button class="copy-button">复制</a-button>
                                    </a-col>
                                </a-row>
                            </a-col>
                            <div class="delete-area">
                                <a-button type="danger" size="small" :disabled="deleteDisabled"
                                    @click="deleteChannel(channel.id)">删除渠道</a-button>
                            </div>
                        </a-row>
                        <a-form layout="inline" :style="{ marginTop: '20px' }" :model="form" :rules="rules">
                            <a-form-item name="channelName">
                                <a-input placeholder="渠道名称" v-model:value="form.channelName"></a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" @click="createChannel">
                                    创建新渠道
                                </a-button>
                            </a-form-item>
                        </a-form>

                    </a-tab-pane>
                    <a-tab-pane key="template" tab="发布为模版">

                    </a-tab-pane>
                </a-tabs>
            </a-col>
        </a-row>

    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import QRcode from 'qrcode'
import { message, Form } from 'ant-design-vue'
import { GlobalDataProps } from '../../store/index'
import { baseH5URL } from '../../main'

export default defineComponent({
    setup() {
        const store = useStore<GlobalDataProps>()
        const route = useRoute()
        const currentWorkId = route.params.id as string
        const page = computed(() => store.state.editor.page)
        const channels = computed(() => store.state.editor.channels)
        console.log(channels, 'channels');

        const form = reactive({
            channelName: ''
        })
        const rules = reactive({
            channelName: [
                { required: true, message: '标题不能为空', trigger: 'blur' }
            ]
        })
        const { validate } = Form.useForm(form, rules)
        const generateChannelUrl = (id: number) => `${baseH5URL}/p/${page.value.id}-${page.value.uuid}?channel=${id}`
        const createChannel = async () => {
            const payload = {
                name: form.channelName,
                workId: parseInt(currentWorkId)
            }
            try {
                await validate()
                await store.dispatch('createChannel', { data: payload })
                form.channelName = ''
            } catch (error) {
                console.error(error);
            }
        }
        const deleteDisabled = computed(() => store.state.editor.channels.length === 1)
        const deleteChannel = (id: number) => {
            store.dispatch('deleteChannel', { urlParams: { id } })
        }
        onMounted(() => {
            channels.value.forEach(channel => {
                const ele = document.getElementById(`channel-barcode-${channel.id}`) as HTMLCanvasElement
                QRcode.toCanvas(ele, generateChannelUrl(channel.id), { width: 100 }).then(() => {
                    console.log('success');

                })
            })
        })
        return {
            page,
            channels,
            form,
            rules,
            deleteDisabled,
            createChannel,
            deleteChannel,
            generateChannelUrl
        }
    }
})
</script>
<style lang="scss" scoped>
.left-col img {
    width: 80%;
}

.right-col img {
    width: 80px;
}

.left-gap {
    padding-left: 5px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.channel-item {
    padding: 10px 0;
    border-bottom: 1px solid #efefef;
    position: relative;
}

.delete-area {
    position: absolute;
    top: 10px;
    right: 20px;
}

.barcode-container {
    height: 80px;
    width: 80px;
}
</style>