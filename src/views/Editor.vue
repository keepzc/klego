<template>
  <div class="editer-container">
    <a-layout>
      <a-layout-sider width="300" :style="{ background: '#fff' }">
        <div class="sider-container">
          <components-list :list="defaultTextTemplates" @on-item-click="addItem" />
        </div>
      </a-layout-sider>
      <a-layout style="padding:0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <div class="preview-list" id="canvas">
            <edit-wrapper v-for="component in components" :id="component.id" :key="component.id" @set-active="setActive"
              :active="component.id === currentElement?.id">
              <component :is="component.name" v-bind="component.props" />
            </edit-wrapper>

          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider width="300" :style="{ background: '#fff' }">
        <div class="settings-panel">
          <props-table v-if="currentElement && currentElement.props" :props="currentElement.props"
            @change="handleChange">
          </props-table>
          <pre>
            {{ currentElement?.props }}
          </pre>
        </div>
      </a-layout-sider>
    </a-layout>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/index'
import ComponentsList from '../components/ComponentsList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import { defaultTextTemplates } from '../defaultTemplates'
import PropsTable from '@/components/PropsTable.vue'
import { ComponentData } from '../store/editor'
export default defineComponent({
  name: 'editor',
  components: {
    ComponentsList,
    EditWrapper,
    PropsTable,
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)
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
    return {
      components,
      defaultTextTemplates,
      addItem,
      setActive,
      currentElement,
      handleChange
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
