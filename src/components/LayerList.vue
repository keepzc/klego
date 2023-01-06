<template>
    <ul :list="list" class="ant-list-items ant-list-bordered" @drop="onDrop" @dragover="onDragOver">
        <li class="ant-list-item" v-for="(item, index) in list" :key="item.id" @click="handleClick(item.id)"
            draggable="true" :class="{ active: item.id === selectedId, ghost: dragData.currentDragging === item.id }"
            @dragstart="onDragStart($event, item.id, index)" @dragenter="onDragEnter($event, index)"
            :data-index="index">
            <a-tooltip :title="item.isHidden ? '显示' : '隐藏'">
                <a-button shape="circle" @click.stop="handleChange(item.id, 'isHidden', !item.isHidden)">
                    <template v-slot:icon v-if="item.isHidden">
                        <EyeOutlined />
                    </template>
                    <template v-slot:icon v-else>
                        <EyeInvisibleOutlined />
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip :title="item.isLocked ? '解锁' : '锁定'">
                <a-button shape="circle" @click.stop="handleChange(item.id, 'isLocked', !item.isLocked)">
                    <template v-slot:icon v-if="item.isLocked">
                        <UnlockOutlined />
                    </template>
                    <template v-slot:icon v-else>
                        <LockOutlined />
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip title="拖动排序">
                <a-button shape="circle" class="handle">
                    <template v-slot:icon>
                        <DragOutlined />
                    </template></a-button>
            </a-tooltip>
            <InlineEdit :value="(item.layerName as string)"
                @change="(value) => { handleChange(item.id, 'layerName', value) }" />
        </li>
    </ul>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { arrayMoveMutable } from 'array-move'
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined, DragOutlined } from '@ant-design/icons-vue'
import { ComponentData } from '../store/editor'
import InlineEdit from '../components/InlineEdit.vue'
// import { getParentElement } from '../helper'
export default defineComponent({
    props: {
        list: {
            type: Array as PropType<ComponentData[]>,
            required: true
        },
        selectedId: {
            type: String,
            required: true
        }
    },
    emits: ['select', 'change', 'drop'],
    components: {
        EyeOutlined,
        EyeInvisibleOutlined,
        LockOutlined,
        UnlockOutlined,
        DragOutlined,
        InlineEdit
    },
    setup(props, context) {
        const handleClick = (id: string) => {
            context.emit('select', id)
        }
        const dragData = reactive({
            currentDragging: '',
            currentIndex: -1
        })
        let start = -1
        let end = -1
        const onDragStart = (e: DragEvent, id: string, index: number) => {
            dragData.currentDragging = id
            dragData.currentIndex = index
            start = index
        }
        const onDrop = (e: DragEvent) => {
            // const currentEle = getParentElement(e.target as HTMLElement, 'ant-list-item')
            // if (currentEle?.dataset.index) {
            //     const moveIndex = parseInt(currentEle.dataset.index)
            //     arrayMoveMutable(props.list, dragData.currentIndex, moveIndex)
            // }
            context.emit('drop', { start, end })
            dragData.currentDragging = ''

        }
        const onDragEnter = (e: DragEvent, index: number) => {
            console.log('enter', index, dragData.currentIndex);
            if (index !== dragData.currentIndex) {
                arrayMoveMutable(props.list, dragData.currentIndex, index)
                dragData.currentIndex = index
                end = index
            }

        }
        const onDragOver = (e: DragEvent) => {
            e.preventDefault()
        }
        const handleChange = (id: string, key: string, value: boolean) => {
            const data = {
                id,
                key,
                value,
                isRoot: true
            }
            context.emit('change', data)
        }
        return {
            dragData,
            handleChange,
            handleClick,
            onDragStart,
            onDrop,
            onDragOver,
            onDragEnter
        }
    }
})

</script>
<style  scoped>
.ant-list-item {
    padding: 10px 15px;
    transition: all 0.5s ease-out;
    cursor: pointer;
    justify-content: normal;
    border: 1px solid #fff;
    border-bottom-color: #f0f0f0;
}

.ant-list-item.active {
    border: 1px solid #1890ff;
}

.ant-list-item.ghost {
    opacity: .5;
}

.ant-list-item:hover {
    background: #e6f7ff;
}

.ant-list-item>* {
    margin-right: 10px;
}
</style>