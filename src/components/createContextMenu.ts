import { createVNode, render } from 'vue'
import ContextMenu from './ContextMenu.vue'
export interface ActionItem {
    action: (cid: string) => void;
    text: string;
    shortcut: string;
}
const createContextMenu = (actions: ActionItem[], triggerClass = 'edit-wrapper') => {
    const container = document.createElement('div')
    const options = {
        actions,
        triggerClass
    }
    const vm = createVNode(ContextMenu, options)
    // render() 返回void
    render(vm, container)
    document.body.appendChild(container)
    // 使用闭包将销毁函数return出去， 提供外部调用
    return () =>{
        // 使用render(null, container)再次调用 销毁
        render(null, container)
        document.body.removeChild(container)
    }
}

export default createContextMenu