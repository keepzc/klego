import store from "@/store/index";
import { testComponents, ComponentData } from "@/store/editor";
import { testData } from "@/store/templates";
import { clone, last, cloneDeep } from "lodash-es";
import { textDefaultProps } from 'kpzc-lego-components'
const cloneComponents = clone(testComponents);
jest.mock('ant-design-vue')
const getCurrentAndAssert = (text: string) => {
    const currentElement: ComponentData =  store.getters.getCurrentElement
    expect(currentElement.props.text).toBe(text)
}
const getLengthAndAssert = (length: number) => {
    expect(store.state.editor.components.length).toBe(length)
}
const getLastAndAssert = (id: string) => {
    const lastItem = last(store.state.editor.components)
    expect(lastItem?.id).toBe(id)
}
describe("test vuex store", () => {
    it("should have three modules", () => {
        expect(store.state).toHaveProperty("editor");
        expect(store.state).toHaveProperty("templates");
        expect(store.state).toHaveProperty("user");
    });
    describe("test user modules", () => {
        it("test login mutation", () => {
            store.commit("login");
            expect(store.state.user.isLogin).toBeTruthy();
        });
        it("test logout mutation", () => {
            store.commit("logout");
            expect(store.state.user.isLogin).toBeFalsy();
        });
    });
    describe("test template modules", () => {
        it("should have default template", () => {
            expect(store.state.templates.data).toHaveLength(testData.length);
        });
        it("should get correct template by id", () => {
            const selectTemplate = store.getters.getTemplateById(1);
            expect(selectTemplate.title).toBe("前端架构师直播海报");
        });
    });
    describe("test editor module", () => {
        it("should have default component", () => {
            expect(store.state.editor.components).toHaveLength(cloneComponents.length);
        });
        it("should get current component when set active one component", () => {
            store.commit("setActive", cloneComponents[0].id);
            expect(store.state.editor.currentElement).toBe(cloneComponents[0].id);
            const currentElement = store.getters.getCurrentElement;
            expect(currentElement.id).toBe(cloneComponents[0].id);
        });
        it("add component should work fine", () => {
            const payload: ComponentData = {
                name: "l-text",
                id: "123",
                props: {
                    ...textDefaultProps,
                    text: "text1"
                }
            };
            store.commit("addComponent", payload);
            expect(store.state.editor.components).toHaveLength(cloneComponents.length + 1);
            const lastItem = last(store.state.editor.components);
            if(lastItem){
                expect(lastItem.props.text).toBe("text1");
                expect(lastItem.layerName).toBe('图层2')
            }
           
        });
        it('copy & paste component should work fine', ()=>{
            store.commit('copyComponent')
            expect(store.state.editor.copiedComponent).toBeDefined()
            store.commit('pastCopiedComponent')
            expect(store.state.editor.components).toHaveLength(cloneComponents.length + 2);
            const lastItem = last(store.state.editor.components);
            if(lastItem){
                expect(lastItem.props).toEqual(cloneComponents[0].props)
            }
        })
        it('move component should works fine', () => {
            const currentElement = store.getters.getCurrentElement as ComponentData
            const oldValue = parseInt(currentElement.props.left || '0') 
            store.commit('moveComponent', {direction: 'Left', amount: 5, id: currentElement.id})
            expect(currentElement.props.left).toBe(oldValue - 5 + 'px')
            store.commit('moveComponent', {direction: 'Right', amount: 3, id: currentElement.id})
            expect(currentElement.props.left).toBe(oldValue - 5 + 3 + 'px')
        })
        it("update component should work fine", () => {
            const newProps = {
                key: "text",
                value: "update"
            };
            store.commit("updateComponent", newProps);
            const currentElement: ComponentData = store.getters.getCurrentElement;
            expect(currentElement.props.text).toBe("update");
            const newProps2 = {
                key: 'layerName',
                value: 'new layer',
                isRoot: true
            }
            store.commit('updateComponent', newProps2)
            expect(currentElement.layerName).toBe('new layer')
        });
        it.only('undo should works fine', () => {
            store.commit('resetEditor')
            const payload: ComponentData = {
                name: 'l-text',
                id: '1234',
                props: {
                  ...textDefaultProps,
                  text: 'text1'
                }
            }
            store.commit('addComponent', payload)
            const payload2: ComponentData = {
                name: 'l-text',
                id: '2345',
                props: {
                    ...textDefaultProps,
                    text: 'text2'
                }
            }
            store.commit('addComponent', payload2)
            // delete component
            store.commit('deleteComponent', '2345')
            // update a component
            store.commit('updateComponent', {key: 'text', value: 'update', id: '1234'})
            store.commit('setActive', '1234')
            getCurrentAndAssert('update')
            // undo step 1, text should be back to text1
            store.commit('undo')
            getCurrentAndAssert('text1')
             // undo step2, delete component should be back at the right position
            getLengthAndAssert(1)
            store.commit('undo')
            getLengthAndAssert(2)
            getLastAndAssert('2345')
            // undo step3, the 2nd component should be deleted
            store.commit('undo')
            getLengthAndAssert(1)
            getLastAndAssert('1234')
            store.commit('undo')
            getLengthAndAssert(0)

            // redo
            store.commit('redo')
            getLengthAndAssert(1)
            getLastAndAssert('1234')

            store.commit('redo')
            getLengthAndAssert(2)
            getLastAndAssert('2345')

            store.commit('redo')
            store.commit('setActive', '1234')
            getCurrentAndAssert('text1')
        })
    });
});
