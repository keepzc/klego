<template>
    <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
        <input v-model="innerValue" v-if="isEditing" placeholder="文本不能为空" :class="{ 'input-error': !validateCheck }"
            ref="inputRef" class="ant-input" />
        <slot v-else :text="innerValue"><span>{{ innerValue }}</span></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, computed, nextTick } from 'vue'
import useKeyPress from '../hooks/useKeyPress'
import useClickOutside from '../hooks/useClickOutside'
export default defineComponent({
    name: 'inline-edit',
    props: {
        value: {
            type: String,
            required: true
        }
    },
    emits: ['change'],
    setup(props, context) {
        const innerValue = ref(props.value)
        const wrapper = ref<null | HTMLElement>(null)
        const inputRef = ref<null | HTMLInputElement>(null)
        const isEditing = ref(false)
        let cachedOldValue = ''
        const handleClick = () => {
            isEditing.value = true
        }
        const validateCheck = computed(() => innerValue.value.trim() !== '')
        const isOutSide = useClickOutside(wrapper)
        watch(isOutSide, (newValue) => {
            if (!validateCheck.value) {
                return
            }
            if (newValue && isEditing.value) {
                isEditing.value = false
                context.emit('change', innerValue.value)
            }
            isOutSide.value = false
        })
        watch(isEditing, async (isEditing) => {
            if (isEditing) {
                cachedOldValue = innerValue.value
                await nextTick()
                inputRef.value?.focus()
            }
        })
        useKeyPress('Enter', () => {
            if (!validateCheck.value) {
                return
            }
            if (isEditing.value) {
                isEditing.value = false
                context.emit('change', innerValue.value)
            }
        })
        useKeyPress('Escape', () => {
            if (isEditing.value) {
                isEditing.value = false
                innerValue.value = cachedOldValue
            }
        })
        return {
            innerValue,
            isEditing,
            wrapper,
            inputRef,
            validateCheck,
            handleClick
        }
    }
})
</script>
<style  scoped>
.inline-edit {
    cursor: pointer;
}

.ant-input.input-error {
    border: 1px solid #f5222d;
}

.ant-input.input-error:focus {
    border-color: #f5222d;
}

.ant-input.input-error::placeholder {
    color: #f5222d;
}
</style>