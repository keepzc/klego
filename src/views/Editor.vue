<template>
  <div class="editer-container">
    <context-menu :actions="testActions" />
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
          <div class="preview-list" id="canvas-area">
            <div class="body-container" :style="page.props">
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
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { pickBy, forEach } from 'lodash-es'
import initHotKeys from '@/plugins/hotKeys'
import { GlobalDataProps } from '../store/index'
import { ComponentData } from '../store/editor'
import ComponentsList from '../components/ComponentsList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import defaultTextTemplates from '../defaultTemplates'
import PropsTable from '@/components/PropsTable.vue'
import LayerList from '../components/LayerList.vue'
import EditGroup from '../components/EditGroup.vue'
import HistoryArea from './editor/HistoryArea.vue'
import ContextMenu from '../components/ContextMenu.vue'

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
    ContextMenu
  },
  setup() {
    initHotKeys()
    const testActions = [{
      shortcut: ' ctrl + z', text: '撤销', action: () => {
        console.log('撤销');
      }
    }]
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const page = computed(() => store.state.editor.page)
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)
    const activePanel = ref<TabType>('component')
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
      testActions
    }
  }
})
</script>
<style>
.editer-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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
</style>
