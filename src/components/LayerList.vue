<template>
    <draggable :list="list" class="ant-list-items ant-list-bordered" handle=".handle" ghost-class="ghost" item-key="id">
        <template #item="{ element }">
            <li class="ant-list-item" @click="handleClick(element.id)" :class="{ active: element.id === selectedId }">
                <a-tooltip :title="element.isHidden ? '显示' : '隐藏'">
                    <a-button shape="circle" @click.stop="handleChange(element.id, 'isHidden', !element.isHidden)">
                        <template v-slot:icon v-if="element.isHidden">
                            <EyeOutlined />
                        </template>
                        <template v-slot:icon v-else>
                            <EyeInvisibleOutlined />
                        </template>
                    </a-button>
                </a-tooltip>
                <a-tooltip :title="element.isLocked ? '解锁' : '锁定'">
                    <a-button shape="circle" @click.stop="handleChange(element.id, 'isLocked', !element.isLocked)">
                        <template v-slot:icon v-if="element.isLocked">
                            <UnlockOutlined />
                        </template>
                        <template v-slot:icon v-else>
                            <LockOutlined />
                        </template>
                    </a-button>
                </a-tooltip>
                <InlineEdit class="edit-area" :value="(element.layerName as string)"
                    @change="(value) => { handleChange(element.id, 'layerName', value) }" />
                <a-tooltip title="拖动排序">
                    <a-button shape="circle" class="handle">
                        <template v-slot:icon>
                            <DragOutlined />
                        </template></a-button>
                </a-tooltip>
            </li>
        </template>

    </draggable>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import draggable from 'vuedraggable'
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined, DragOutlined } from '@ant-design/icons-vue'
import { ComponentData } from '../store/editor'
import InlineEdit from '../components/InlineEdit.vue'
import { getParentElement } from '../helper'
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
    emits: ['select', 'change'],
    components: {
        EyeOutlined,
        EyeInvisibleOutlined,
        LockOutlined,
        UnlockOutlined,
        DragOutlined,
        InlineEdit,
        draggable
    },
    setup(props, context) {
        const handleClick = (id: string) => {
            context.emit('select', id)
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
            handleChange,
            handleClick,
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

.ant-list-item .handle {
    cursor: move;
    margin-left: auto;
}

.ant-list-item .edit-area {
    width: 100%;
}
</style>