<template>
  <div class="edit-wrapper" ref="editWrapper" :style="styles" @mousedown="startMove" @click="onItemClick(id)"
    :class="{ active: active, hidden: hidden }">
    <slot></slot>
    <div class="resizers">
      <div class='resizer top-left'></div>
      <div class='resizer top-right'></div>
      <div class='resizer bottom-left'></div>
      <div class='resizer bottom-right' @mousedown.stop="startResize"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, nextTick } from 'vue'
import { pick } from 'lodash-es'
export default defineComponent({
  props: {
    id: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object
    }
  },
  emits: ['set-active', 'update-position'],
  setup(props, context) {
    const editWrapper = ref<null | HTMLElement>(null)
    const onItemClick = (id: string) => {
      context.emit('set-active', id)
    }
    // 鼠标移动元素偏移量
    const gap = {
      x: 0,
      y: 0
    }
    let isMoving = false
    const styles = computed(() => pick(props.props, ['position', 'top', 'left', 'width', 'height']))
    const caculateMovePosition = (e: MouseEvent) => {
      const container = document.getElementById('canvas-area') as HTMLElement
      const left = e.clientX - gap.x - container.offsetLeft
      const top = e.clientY - gap.y - container.offsetTop
      return {
        top,
        left
      }
    }
    // 元素缩放
    const startResize = (e: MouseEvent) => {
      const currentElement = editWrapper.value
      const handleMove = (e: MouseEvent) => {
        if (currentElement) {
          const { left, top } = currentElement.getBoundingClientRect()
          currentElement.style.width = e.clientX - left + 'px'
          currentElement.style.height = e.clientY - top + 'px'
        }
      }
      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMove)
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    const startMove = (e: MouseEvent) => {
      const currentElement = editWrapper.value
      if (currentElement) {
        const { left, top } = currentElement.getBoundingClientRect()
        gap.x = e.clientX - left
        gap.y = e.clientY - top
      }
      const handleMove = (e: MouseEvent) => {
        // 元素画布内移动距离
        const { left, top } = caculateMovePosition(e)
        isMoving = true
        if (currentElement) {
          currentElement.style.top = top + 'px'
          currentElement.style.left = left + 'px'
        }
      }
      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMove)
        if (isMoving) {
          const { left, top } = caculateMovePosition(e)
          context.emit('update-position', { left, top, id: props.id })
          isMoving = false
        }
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return {
      onItemClick,
      styles,
      editWrapper,
      startMove,
      startResize
    }
  }
})
</script>

<style>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  box-sizing: content-box !important;
}

.edit-wrapper>* {
  position: static !important;
  width: 100% !important;
  height: 100% !important;
}

.edit-wrapper:hover {
  border: 1px dashed #ccc;
}

.edit-wrapper.hidden {
  display: none;
}

.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}

.edit-wrapper .resizers {
  display: none;
}

.edit-wrapper.active .resizers {
  display: block;
}

.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #1890ff;
  position: absolute;
}

.edit-wrapper.active .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}

.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}

.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}

.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
