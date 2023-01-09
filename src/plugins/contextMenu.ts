import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import createContextMenu, { ActionItem} from '@/components/createContextMenu'

const initContextMenu = () => {
    const store = useStore()
    const testActions: ActionItem[] = [
        { shortcut: '⌘C / Ctrl+C', text: '拷贝图层', action: (cid) => { store.commit('copyComponent', cid)} },
        { shortcut: '⌘V / Ctrl+V',text: '粘贴图层', action: () => { store.commit('pastCopiedComponent')} },
        { shortcut: 'Backspace / Delete', text: '删除图层', action: (cid) => { store.commit('deleteComponent', cid) } },
        { shortcut: 'ESC',text: '取消选中', action: () => { store.commit('setActive', '')} },
    ]
    // 可以创建多个右键菜单 settings-panel
    // const testActions2: ActionItem[] = [
    //     {
    //         shortcut: ' Ctrl + c', 
    //         text: '复制', 
    //         action: () => { console.log('撤销')}
    //     }
    // ]
    let destory: any
    onMounted(() => {
        destory = createContextMenu(testActions)
        //destory2 = createContextMenu(testActions2, 'settings-panel')
    })
    onUnmounted(() => {
        destory()
    })
}

export default initContextMenu

export const operationText: { [key: string]: {text: string; shortcut: string} } = {
    copy: {
      text: '拷贝图层',
      shortcut: '⌘C / Ctrl+C'
    },
    paste: {
      text: '粘贴图层',
      shortcut: '⌘V / Ctrl+V'
    },
    delete: {
      text: '删除图层',
      shortcut: 'Backspace / Delete'
    },
    cancel: {
      text: '取消选中',
      shortcut: 'ESC'
    },
    undo: {
      text: '撤销',
      shortcut: '⌘Z / Ctrl+Z'
    },
    redo: {
      text: '重做',
      shortcut: '⌘⇧Z / Ctrl+Shift+Z'
    },
    move: {
      text: '上下左右移动一像素',
      shortcut: '↑ ↓ → ←'
    },
    moveTen: {
      text: '上下左右移动十像素',
      shortcut: 'Shift + ↑ ↓ → ←'
    }
}