import useHotKey from '../hooks/useHotkey'
import {KeyHandler, HotkeysEvent} from 'hotkeys-js'
import {useStore} from 'vuex'
import { computed } from 'vue'

import {GlobalDataProps} from '../store/index'

const warp = (callback: KeyHandler) => {
    const wrapperFn = (e: KeyboardEvent, event: HotkeysEvent) => {
        e.preventDefault()
        callback(e, event)
    }
    return wrapperFn
}
export default function initHotKeys() {
    const store = useStore<GlobalDataProps>()
    const currentId = computed(()=> store.state.editor.currentElement)
    useHotKey('ctrl+c, command+c', () => {
        store.commit('copyComponent', currentId.value)
        
    })
    useHotKey('ctrl+v, command+v', ()=>{
        store.commit('pastCopiedComponent')
    })
    useHotKey('backspace, delete', () => {
        store.commit('deleteComponent', currentId.value)
    })
    useHotKey('esc',()=>{
        store.commit('setActive', '')
    })
    useHotKey('up', warp(()=> {
        store.commit('moveComponent', {direction:'Up', amount: 1, id: currentId.value})
    }))
    useHotKey('down', warp(() => {
        store.commit('moveComponent', { direction: 'Down', amount: 1, id: currentId.value})
    }))
    useHotKey('left', warp(() => {
        store.commit('moveComponent', { direction: 'Left', amount: 1, id: currentId.value})
    }))
    useHotKey('right', warp(() => {
        store.commit('moveComponent', { direction: 'Right', amount: 1, id: currentId.value})
    }))
}