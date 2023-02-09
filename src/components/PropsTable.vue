<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" :class="{ 'no-text': !value.text }" :id="`item-${key}`"
      class="prop-item">
      <span class="label" v-if="value.text">{{ value.text }}</span>
      <div :class="`prop-component component-${value.component}`">
        <component :is="value.component" :[value.valueProp]="value.value" v-bind="value.extraProps" v-on="value.events">
          <template v-if="value.options">
            <component :is="value.subComponent" v-for="(option, k) in value.options" :key="k" :value="option.value">
              <render-vnode :vNode="option.text"></render-vnode>
            </component>
          </template>
        </component>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, VNode } from 'vue'
import { reduce } from 'lodash-es'
import { mapPropsToForms } from '../propsMap'
import { AllComponentProps } from 'kpzc-lego-components'
import RenderVnode from './RenderVnode'
import ColorPicker from './ColorPicker.vue'
import ImageProcesser from './ImageProcesser.vue'
import IconSwitch from './IconSwitch.vue'
import ShadowPicker from './ShadowPicker.vue'
import BackgroundProcesser from './BackgroundProcesser.vue'
interface FormProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  valueProp: string;
  eventName?: string;
  events: { [key: string]: (e: any) => void };
}
export default defineComponent({
  props: {
    props: {
      type: Object as PropType<Partial<AllComponentProps>>,
      required: true
    }
  },
  components: {
    RenderVnode,
    ColorPicker,
    ImageProcesser,
    IconSwitch,
    ShadowPicker,
    BackgroundProcesser
  },
  emits: ['change'],
  name: 'props-table',
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(props.props, (result, value, key) => {
        const newKey = key as keyof AllComponentProps
        const item = mapPropsToForms[newKey]
        if (item) {
          const { valueProp = 'value', initalTransform, eventName = 'change', afterTransform } = item
          const newItem: FormProps = {
            ...item,
            value: initalTransform ? initalTransform(value) : value,
            valueProp,
            eventName,
            events: {
              [eventName]: (e: any) => { context.emit('change', { key, value: afterTransform ? afterTransform(e) : e }) }
            }
          }
          result[newKey] = newItem
        }
        return result
      }, {} as { [key: string]: FormProps })
    })
    console.log(finalProps);

    return {
      finalProps
    }
  }
})
</script>

<style>
.prop-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.label {
  width: 28%;
}

.prop-component {
  width: 70%;
}

.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 0 0;
}

#item-fontWeight {
  margin-left: 28%;
}

.component-a-select .ant-select {
  width: 150px;
}

.prop-component.component-shadow-picker,
.prop-component.component-image-processer,
.prop-component.component-background-processer {
  width: 100%;
}
</style>
