import { Module } from "vuex";
import {message} from 'ant-design-vue'
import {cloneDeep} from 'lodash-es'
import { v4 as uuidv4 } from "uuid";
import store, { GlobalDataProps } from "./index";
import {insertAt} from '../helper'
// import { TextComponentProps, ImageComponentProps } from "../defaultProps";
import {AllComponentProps,textDefaultProps } from 'kpzc-lego-components'
export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'

export interface HistoryProps{
    id: string;
    componentId: string;
    type: 'add' | 'delete' | 'modify',
    data: any;
    index?: number
}

export interface EditorProps {
    //编辑器渲染数组
    components: ComponentData[];
    //当前编辑器那个元素
    currentElement: string;
    // 当然最后保存的时候还有有一些项目信息，这里并没有写出，等做到的时候再补充
    page: PageData;
    // 当前被复制的组件
    copiedComponent?: ComponentData;
    // 当前操作的历史记录
    histories: HistoryProps[];
    // 当前历史记录的操作位置
    historyIndex: number;
}

export interface PageProps {
    backgroundColor: string;
    backgroundImage: string;
    backgroundRepeat: string;
    backgroundSize: string;
    height: string;
}

export type AllFormProps = PageProps & AllComponentProps

export interface PageData {
    props: PageProps;
    title: string;
}
export interface ComponentData {
    //这个元素属性
    props: Partial<AllComponentProps>;
    //id uuid v4 生成
    id: string;
    //业务组件库名称 l-text,l-image 登登
    name: "l-text" | "l-image" | "l-shape";
    // 图层是否隐藏
    isHidden?: boolean;
    // 图层是否锁定
    isLocked?: boolean;
    // 图层名称
    layerName?: string;
}

export const testComponents: ComponentData[] = [
    { id: uuidv4(), name: 'l-text', layerName:'图层1', props: { ...textDefaultProps, text: 'hello', fontSize: '20px', color: '#000000', 'lineHeight': '1', textAlign: 'left', fontFamily: '', width: '100px', height: '100px', backgroundColor: '#efefef', left: '10px', top: '10px' }},
    // {
    //     id: uuidv4(),
    //     name: "l-text",
    //     layerName:'图层2',
    //     props: {
    //         ...textDefaultProps,
    //         text: "hello2",
    //         fontSize: "10px",
    //         fontWeight: "bold",
    //         lineHeight: "2",
    //         textAlign: "left",
    //         fontFamily: ""
    //     }
    // },
    // {
    //     id: uuidv4(),
    //     name: "l-text",
    //     layerName:'图层3',
    //     props: { ...textDefaultProps,text: "hello3", fontSize: "16px" }
    // }
];
const pageDefaultProps = { backgroundColor: '#ffffff', backgroundImage: '', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '560px' }
const editor: Module<EditorProps, GlobalDataProps> = {
    state: {
        components: testComponents,
        currentElement: "",
        page: {
            props: pageDefaultProps,
            title: 'test title'
        },
        histories: [],
        historyIndex: -1
    },
    mutations: {
        resetEditor(state){
            state.components = []
            state.currentElement = ''
            state.historyIndex = -1
            state.histories = []
        },
        addComponent(state, component: ComponentData) {
            component.layerName = '图层' + (state.components.length + 1)
            state.components.push(component);
            state.histories.push({
                id:uuidv4(),
                componentId: component.id,
                type: 'add',
                data: cloneDeep(component)
            })
        },
        setActive(state, currentId: string) {
            state.currentElement = currentId;
        },
        // command + z 向前操作
        undo(state){
            // never undo before
            if(state.historyIndex === -1){
                // undo the last item of the array
                state.historyIndex = state.histories.length - 1
            }else {
                // undo to the previous step
                state.historyIndex--
            }
            // get the history record
            const history = state.histories[state.historyIndex]
            switch (history.type) {
                case 'add':
                    // if create component ,we should remove it
                    state.components = state.components.filter(component => component.id !== history.componentId)
                    break;
                case 'delete':
                    // if delete a component, we should restore it to the right position
                    state.components = insertAt(state.components, history.index as number, history.data)
                    break;
                case 'modify':
                    // get the modified component by id, restore to the old value
                    const {componentId, data} = history
                    const {key, oldValue} =data
                    const updateComponent = state.components.find(component => component.id === componentId)
                    if(updateComponent){
                        updateComponent.props[key as keyof AllComponentProps] = oldValue
                    }
                    break
                default:
                    break;
            }
        },
        // 前进
        redo(state){
            // can't redo when historyIndex is last item or historyIndex is never moved
            if(state.historyIndex === -1) {
                return
            }
            // get record
            const history = state.histories[state.historyIndex]
            // process the history data
            switch (history.type) {
                case 'add':
                    state.components.push(history.data)
                    break;
                case 'delete':
                    state.components = state.components.filter(component => component.id !== history.componentId)
                    break;
                case 'modify':
                    const {componentId, data} = history
                    const {key, newValue} = data
                    const  updateComponent = state.components.find(component => component.id === componentId)
                    if(updateComponent){
                        updateComponent.props[key as keyof AllComponentProps] = newValue
                    }
                    break;
                default:
                    break;
            }
            state.historyIndex++
        },
        copyComponent(state, id: string){
            const currentComponent = store.getters.getElement(id)
            if(currentComponent) {
                state.copiedComponent = currentComponent
                message.success('已拷贝当前图层', 1)
            }
        },
        pastCopiedComponent(state){
            if(state.copiedComponent){
                const clone = cloneDeep(state.copiedComponent)
                clone.id = uuidv4()
                clone.layerName = clone.layerName + '副本'
                state.components.push(clone)
                message.success('已粘贴当前图层', 1)
                state.histories.push({
                    id:uuidv4(),
                    componentId: clone.id,
                    type: 'add',
                    data: cloneDeep(clone)
                })
            }
        },
        deleteComponent(state, id: string) {
            const currentComponent = state.components.find(component=> component.id === id)
            if(currentComponent){
                const currentIndex = state.components.findIndex(component => component.id === id)
                state.components = state.components.filter(component => component.id !== id)
                state.histories.push({
                    id: uuidv4(),
                    componentId: currentComponent.id,
                    type: 'delete',
                    data: currentComponent,
                    index: currentIndex
                })
                message.success('删除当前图层成功', 1)
            }
        },
        moveComponent(state, data: {direction: MoveDirection; amount: number; id: string}){
            const currentComponent = state.components.find(component=> component.id === data.id)
            if(currentComponent){
                const oldTop = parseInt(currentComponent.props.top || '0') 
                const oldLeft = parseInt(currentComponent.props.left || '0') 
                const {direction, amount} = data
                switch (direction) {
                    case 'Up':{
                        const newValue = oldTop - amount + 'px'
                        store.commit('updateComponent', { key: 'top', value: newValue, id: data.id })
                        break;
                    }
                    case 'Down': {
                        const newValue = oldTop + amount + 'px'
                        store.commit('updateComponent', { key: 'top', value: newValue, id: data.id })
                        break
                    }
                    case 'Left': {
                        const newValue = oldLeft - amount + 'px'
                        store.commit('updateComponent', { key: 'left', value: newValue, id: data.id })
                        break
                    }
                    case 'Right': {
                        const newValue = oldLeft + amount + 'px'
                        store.commit('updateComponent', { key: 'left', value: newValue, id: data.id })
                        break
                    }
                    default:
                        break;
                }
            }
        },
        updateComponent(state, { key, value ,id, isRoot}) {
            const updatedComponent = state.components.find((component) => component.id === (id || state.currentElement));
            if (updatedComponent) {
                if(isRoot) {
                    // https://github.com/microsoft/TypeScript/issues/31663
                    (updatedComponent as any)[key] = value
                }else {
                    const oldValue = updatedComponent.props[key as keyof AllComponentProps]
                    updatedComponent.props[key as keyof AllComponentProps] = value;
                    state.histories.push({
                        id: uuidv4(),
                        componentId: (id || state.currentElement),
                        type:'modify',
                        data: {
                            oldValue,
                            newValue: value,
                            key
                        }
                    })
                }
                
            }
        },
        updatePage(state, {key,value}) {
            state.page.props[key as keyof PageProps] = value
        }
    },
    getters: {
        getCurrentElement: (state) => {
            return state.components.find((component) => component.id === state.currentElement);
        },
        getElement: (state) => (id: string) => {
            return state.components.find(component => component.id === (id || state.currentElement))
        },
        checkUndoDisable: (state) => {
            // 1 no history item
            // 2 move to the first item
            if (state.histories.length === 0 || state.historyIndex === 0) {
              return true
            }
            return false
        },
        checkRedoDisable: (state) => {
            // 1 no history item
            // 2 move to the last item
            // 3 never undo before
            if (state.histories.length === 0 || 
              state.historyIndex === state.histories.length ||
              state.historyIndex === -1) {
              return true
            }
            return false      
        }
    }
};

export default editor;
