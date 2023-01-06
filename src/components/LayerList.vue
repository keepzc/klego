<template>
    <ul :list="list" class="ant-list-items ant-list-bordered">
        <li class="ant-list-item" @click="handleClick(item.id)" :class="{ active: item.id === selectedId }"
            v-for="item in list" :key="item.id">
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
            <InlineEdit :value="item.layerName" @change="(value) => { handleChange(item.id, 'layerName', value) }" />
        </li>
    </ul>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined, DragOutlined } from '@ant-design/icons-vue'
import { ComponentData } from '../store/editor'
import InlineEdit from '../components/InlineEdit.vue'
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
        InlineEdit
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

.ant-list-item:hover {
    background: #e6f7ff;
}

.ant-list-item>* {
    margin-right: 10px;
}
</style>