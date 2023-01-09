import { createVNode, render } from 'vue'
import ContextMenu from './ContextMenu.vue'
export interface ActionItem {
    action: () => void;
    text: string;
    shortcut: string;
}
const createContextMenu = (actions: ActionItem[]) => {
    const container = document.createElement('div')
    const options = {
        actions
        
    }
    const vm = createVNode(ContextMenu, options)
    render(vm, container)
    document.body.appendChild(container)
}

export default createContextMenu