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
                <a-tabs type="card" :style="{ marginTop: '20px' }" v-model:activeKey="activeKey">
                    <a-tab-pane key="channels" tab="发布为作品">
                        <a-row v-for="channel in channels" :key="channel.id" class="channel-item">
                            <a-col :span="6">
                                <canvas class="barcode-container" :id="`channel-barcode-${channel.id}`"></canvas>
                            </a-col>
                            <a-col :span="18" class="left-gap">
                                <h4>{{ channel.name }}</h4>
                                <a-row>
                                    <a-col :span="18">
                                        <a-input :value="generateChannelUrl(channel.id)" :readonly="true"
                                            :id="`channel-url-${channel.id}`" />
                                    </a-col>
                                    <a-col :span="6">
                                        <a-button class="copy-button" shape="round"
                                            :data-clipboard-target="`#channel-url-${channel.id}`">复制</a-button>
                                    </a-col>
                                </a-row>
                            </a-col>
                            <div class="delete-area">
                                <a-button type="danger" size="small" :disabled="deleteDisabled" shape="round"
                                    @click="deleteChannel(channel.id)">删除渠道</a-button>
                            </div>
                        </a-row>
                        <a-form layout="inline" :style="{ marginTop: '20px' }" :model="form" :rules="rules">
                            <a-form-item name="channelName">
                                <a-input placeholder="渠道名称" v-model:value="form.channelName"></a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" shape="round" @click="createChannel">
                                    创建新渠道
                                </a-button>
                            </a-form-item>
                        </a-form>

                    </a-tab-pane>
                    <a-tab-pane key="template" tab="发布为模版">
                        <a-row class="template-item">
                            <a-col :span="6">
                                <canvas class="barcode-container" id="template-barcode"></canvas>
                            </a-col>
                            <a-col :span="18">
                                <h4>模版信息</h4>
                                <a-row>
                                    <a-col :span="18">
                                        <a-input :value="generateTemplateUrl" :readonly="true" />
                                    </a-col>
                                    <a-col :span="6">
                                        <a-button class="copy-button" shape="round"
                                            :data-clipboard-target="222">复制</a-button>
                                    </a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                        <a-row class="template-btn">
                            <a-button type="primary" shape="round" :loading="saveIsLoading"
                                @click="publishTemplate">发布模板</a-button>
                        </a-row>
                    </a-tab-pane>
                </a-tabs>
            </a-col>
        </a-row>

    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch, onUnmounted, nextTick, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { last } from 'lodash-es'
import ClipboardJS from 'clipboard'
import { message, Form } from 'ant-design-vue'
import { GlobalDataProps } from '../../store/index'
import { baseH5URL } from '../../main'
import { generateQRCode } from '../../helper'
import { emit } from 'process'
export type TabType = 'channels' | 'template'

export default defineComponent({
    emits: ['close:visible'],
    setup(props, { emit }) {
        const store = useStore<GlobalDataProps>()
        const route = useRoute()
        const currentWorkId = route.params.id as string
        const page = computed(() => store.state.editor.page)
        const channels = computed(() => store.state.editor.channels)
        const saveIsLoading = computed(() => store.getters.isOpLoading('publishTemplate'))
        const activeKey = ref<TabType>('template')
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
        const generateTemplateUrl = `${baseH5URL}/p/${page.value.id}-${page.value.uuid}`
        const createChannel = async () => {
            const payload = {
                name: form.channelName,
                workId: parseInt(currentWorkId)
            }
            try {
                await validate()
                await store.dispatch('createChannel', { data: payload })
                form.channelName = ''
            } catch (e) {
                console.error(e);
            }
        }
        const deleteDisabled = computed(() => store.state.editor.channels.length === 1)
        const deleteChannel = (id: number) => {
            store.dispatch('deleteChannel', { urlParams: { id } })
        }
        const publishTemplate = async (id: number) => {
            const res = await store.dispatch('publishTemplate', { urlParams: { id: currentWorkId } })
            console.log(res);
            if (res.errno === 0) {
                message.success('发布模版成功')
            }
            emit('close:visible')
        }
        onMounted(async () => {
            const clipboard = new ClipboardJS('.copy-button')
            clipboard.on('success', (e) => {
                message.success('复制成功', 1)
                e.clearSelection()
            })
            // 渲染模版二维码
            await nextTick()
            generateQRCode('template-barcode', generateTemplateUrl)
            // channels.value.forEach(async channel => {
            //     try {
            //         await generateQRCode(`channel-barcode-${channel.id}`, generateChannelUrl(channel.id))
            //     } catch (e) {
            //         console.log(e);
            //     }
            // })
        })
        onUnmounted(() => {
            form.channelName = ''
        })
        watch(activeKey, async (newKey, oldKey) => {
            await nextTick()
            if (newKey === 'channels') {
                channels.value.forEach(async channel => {
                    try {
                        await generateQRCode(`channel-barcode-${channel.id}`, generateChannelUrl(channel.id))
                    } catch (e) {
                        console.log(e);
                    }
                })
            }
        })
        watch(channels, async (newChannels, oldChannels) => {
            if (newChannels.length > oldChannels.length) {
                // 获取channels最后一项 用lodash 的last方法
                const createdChannels = last(newChannels)
                if (createdChannels) {
                    await generateQRCode(`channel-barcode-${createdChannels.id}`, generateChannelUrl(createdChannels.id))
                }
            }

        }, {
            // dom节点生成后运行watch
            flush: 'post'
        })
        return {
            page,
            activeKey,
            channels,
            form,
            rules,
            deleteDisabled,
            createChannel,
            deleteChannel,
            generateChannelUrl,
            publishTemplate,
            generateTemplateUrl,
            saveIsLoading
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

.template-item {
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

.ant-input {
    border-radius: 20px;
}

.ant-tabs .ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    border-radius: 20px 20px 0 0 !important;
}

.template-btn {
    margin-top: 20px;
    justify-content: center;
}
</style>