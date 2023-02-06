<template>
  <div class="editer-container">
    <a-modal title="发布成功" v-model:visible="showPublishForm" width="700px" :footer="null">
      <publish-form @close:visible="closePublishModel" />
    </a-modal>
    <preview-form :visible="showPreviewForm" v-if="showPreviewForm" @update:visible="closeDrawer"></preview-form>
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img alt="慕课乐高" src="../assets/logo-simple.png" class="logo-img">
          </router-link>
          <inline-edit :value="(page.title as string)" @change="titleChange" />
        </div>
        <a-menu :selectable="false" theme="dark" mode="horizontal" :style="{ lineHeight: '64px', width: '525px' }">
          <a-menu-item key="1">
            <a-button type="primary" shape="round" @click="preview">预览和设置</a-button>
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary" shape="round" @click="saveWork" :loading="saveIsLoading">保存</a-button>
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary" shape="round" @click="publish" :loading="isPublishing">发布</a-button>
          </a-menu-item>
          <a-menu-item key="4">
            <user-profile :user="userInfo"></user-profile>
          </a-menu-item>
        </a-menu>

      </a-layout-header>
    </a-layout>
    <a-layout>

      <a-layout-sider width="300" :style="{ background: '#fff' }">
        <div class="sider-container">
          <components-list :list="defaultTextTemplates" @on-item-click="addItem" />
        </div>
      </a-layout-sider>
      <a-layout style="padding:0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <history-area />
          <div class="preview-list" id="canvas-area" :class="{ 'canvas-fix': canvasFix }">
            <div class="body-container" :style="(page.props)">
              <edit-wrapper v-for="component in components" :id="component.id" :key="component.id"
                @set-active="setActive" @update-position="updatePosition" :active="component.id === currentElement?.id"
                :props="component.props" :hidden="component.isHidden">
                <component :is="component.name" v-bind="component.props" />
              </edit-wrapper>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider width="300" :style="{ background: '#fff' }" class="settings-panel">
        <a-tabs type="card" v-model:activeKey="activePanel">
          <a-tab-pane key="component" tab="属性设置">
            <div v-if="currentElement">
              <edit-group v-if="!currentElement.isLocked" :props="currentElement.props" @change="handleChange">
              </edit-group>
              <div v-else>
                <a-empty>
                  <template #description>
                    <p>该元素被锁定，无法编辑</p>
                  </template>
                </a-empty>
              </div>
            </div>

            <pre>
              {{ currentElement && currentElement.props }}
            </pre>
          </a-tab-pane>
          <a-tab-pane key="layer" tab="图层设置">
            <layer-list :selectedId="(currentElement?.id as string)" :list="components" @change="handleChange"
              @select="setActive">
            </layer-list>
          </a-tab-pane>
          <a-tab-pane key="page" tab="页面设置">
            <props-table :props="page.props" @change="pageChange">
            </props-table>
          </a-tab-pane>
        </a-tabs>

      </a-layout-sider>
    </a-layout>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { pickBy } from 'lodash-es'
import initHotKeys from '@/plugins/hotKeys'
import initContextMenu from '@/plugins/contextMenu'
import { GlobalDataProps } from '../store/index'
import { ComponentData } from '../store/editor'
import ComponentsList from '../components/ComponentsList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import defaultTextTemplates from '../defaultTemplates'
import PropsTable from '@/components/PropsTable.vue'
import LayerList from '../components/LayerList.vue'
import EditGroup from '../components/EditGroup.vue'
import HistoryArea from './editor/HistoryArea.vue'
import InlineEdit from '../components/InlineEdit.vue'
import UserProfile from '../components/UserProfile.vue'
import PublishForm from './editor/PublishForm.vue'
import PreviewForm from './editor/PreviewForm.vue'
import useSaveWork from '../hooks/useSaveWork'
import usePublishWork from '../hooks/usePublishWork'
export type TabType = 'component' | 'layer' | 'page'
export default defineComponent({
  name: 'editor',
  components: {
    ComponentsList,
    EditWrapper,
    PropsTable,
    LayerList,
    EditGroup,
    HistoryArea,
    InlineEdit,
    UserProfile,
    PublishForm,
    PreviewForm
  },
  setup() {
    initHotKeys()
    // 初始化右键操作菜单
    initContextMenu()
    const route = useRoute()
    const currentWorkId = route.params.id
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const page = computed(() => store.state.editor.page)
    const userInfo = computed(() => store.state.user)
    const canvasFix = ref(false)
    const showPublishForm = ref(false)
    const showPreviewForm = ref(false)
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)
    const activePanel = ref<TabType>('component')
    const { saveWork, saveIsLoading } = useSaveWork()
    const { publishWork, isPublishing } = usePublishWork()
    onMounted(() => {
      if (currentWorkId) {
        store.dispatch('fetchWork', { urlParams: { id: currentWorkId } })
      }
    })
    const addItem = (props: any) => {
      console.log(props, '555')
      store.commit('addComponent', props)
    }
    const setActive = (id: string) => {
      store.commit('setActive', id)
    }
    const handleChange = (e: any) => {
      console.log('event', e)
      store.commit('updateComponent', e)
    }
    const pageChange = (e: any) => {
      console.log('page', e)
      store.commit('updatePage', e)
    }
    const titleChange = (newTitle: string) => {
      store.commit('updatePage', { key: 'title', value: newTitle, isRoot: true })
    }
    const updatePosition = (data: { width: number; height: number; left: number; top: number; id: string }) => {
      const { id } = data
      const updatedData = pickBy<number>(data, (v, k) => k !== 'id')
      // forEach(updatedData, (v, key) => {
      //   store.commit('updateComponent', { key, value: v + 'px', id })
      // })
      // 为了解决多次调用 updateComponent的问题
      const keysArr = Object.keys(updatedData)
      const valuesArr = Object.values(updatedData).map(item => item + 'px')
      store.commit('updateComponent', { key: keysArr, value: valuesArr, id })
    }
    const publish = async () => {
      // remove select element
      store.commit('setActive', '')
      const el = document.getElementById('canvas-area') as HTMLElement
      canvasFix.value = true
      await nextTick()
      try {
        await publishWork(el)
        showPublishForm.value = true
      } catch (error) {
        console.error(error);
      } finally {
        canvasFix.value = false
      }
      // html2canvas(el, { width: 375, useCORS: true, scale: 1 }).then(canvas => {
      //   const image = document.getElementById('test-image') as HTMLImageElement
      //   image.src = canvas.toDataURL()
      //   canvasFix.value = false
      // })
    }
    const closePublishModel = () => {
      showPublishForm.value = false
    }
    const preview = async () => {
      await saveWork()
      showPreviewForm.value = true
    }
    // 关闭抽屉
    const closeDrawer = () => {
      showPreviewForm.value = false
    }
    return {
      components,
      defaultTextTemplates,
      addItem,
      setActive,
      currentElement,
      handleChange,
      pageChange,
      activePanel,
      page,
      updatePosition,
      titleChange,
      userInfo,
      saveWork,
      saveIsLoading,
      publish,
      canvasFix,
      isPublishing,
      showPublishForm,
      showPreviewForm,
      preview,
      closeDrawer,
      closePublishModel
    }
  }
})
</script>
<style lang="scss" scoped>
.editer-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .ant-menu-dark.ant-menu-horizontal>.ant-menu-item:hover {
    background-color: none !important;
  }
}

.editer-container .preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 300px;
  border: 1px solid #fefefe;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}

.aside h2 {
  color: #CCCCCC;
  font-size: 29px;
}

.aside-inner {
  width: 60%;
  text-align: center;
}

.login-area {
  height: 100vh;
}

.aside-inner {
  width: 60%;
  text-align: center;
}

.page-title {
  display: flex;
}

.page-title .inline-edit span {
  font-weight: 500;
  margin-left: 10px;
  font-size: 16px;
}

// html2canvas 不识别box-shadow属性
.preview-list.canvas-fix .edit-wrapper>* {
  box-shadow: none !important;
}

// html2canvas截图由于max-height设置导致截图不全
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
</style>
