<script lang="ts">
import { defineComponent, PropType, ref, onMounted, onUnmounted } from 'vue'
import { getParentElement } from '../helper'
interface ActionItem {
    action: () => void;
    text: string;
    shortcut: string;
}
export default defineComponent({
    props: {
        actions: {
            type: Array as PropType<ActionItem[]>,
            required: true
        }
    },
    setup(props, context) {
        const menuRef = ref<HTMLElement | null>(null)
        const triggerContextMenu = (e: MouseEvent) => {
            const domElement = menuRef.value as HTMLElement
            const wrapperElement = getParentElement(e.target as HTMLElement, 'edit-wrapper')
            if (wrapperElement) {
                e.preventDefault()
                domElement.style.display = 'block'
                domElement.style.top = e.clientY + 'px'
                domElement.style.left = e.clientX + 'px'
            }
        }
        const handleClick = () => {
            const domElement = menuRef.value as HTMLElement
            domElement.style.display = 'none'
        }
        onMounted(() => {
            document.addEventListener('contextmenu', triggerContextMenu)
            document.addEventListener('click', handleClick)
        })
        onUnmounted(() => {
            document.removeEventListener('contextmenu', triggerContextMenu)
            document.removeEventListener('click', handleClick)
        })
        return {
            menuRef
        }
    }
})
</script>

<template>
    <div class="context-menu-component menu-container" ref="menuRef">
        <ul class="ant-menu-light ant-menu-root ant-menu ant-menu-vertical">
            <li v-for="(action, index) in actions" :key="index" @click="action.action" class="ant-menu-item">
                <span class="item-text">{{ action.text }}</span>
                <span class="item-shortcut">{{ action.shortcut }}</span>
            </li>
        </ul>
    </div>
</template>

<style  scoped>
.menu-container {
    display: none;
    position: absolute;
    background: #fff;
    z-index: 2000;
    width: 220px;
    border: 1px solid #ccc;
}

.menu-container .ant-menu-item {
    display: flex;
    justify-content: space-between;
}

.menu-container .ant-menu-item:hover {
    background: #efefef;
}

.ant-menu-item .item-shortcut {
    color: #ccc;
}
</style>