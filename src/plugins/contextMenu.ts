import { onMounted } from 'vue'
import { useStore } from 'vuex'
import createContextMenu, { ActionItem} from '@/components/createContextMenu'

const initContextMenu = () => {
    const store = useStore()
    const testActions: ActionItem[] = [
        { shortcut: 'Backspace / Delete', text: '删除图层', action: (cid) => { store.commit('deleteComponent', cid) }}
    ]
    // 可以创建多个右键菜单 settings-panel
    // const testActions2: ActionItem[] = [
    //     {
    //         shortcut: ' Ctrl + c', 
    //         text: '复制', 
    //         action: () => { console.log('撤销')}
    //     }
    // ]
    onMounted(() => {
        createContextMenu(testActions)
        // createContextMenu(testActions2, 'settings-panel')
    })
}

export default initContextMenu