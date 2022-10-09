import { shallowMount, VueWrapper } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";
import flushPromises from "flush-promises";
import Hello from "@/components/Hello.vue";

jest.mock("axios");
//将mock断言为特定类型
const mockAxios = axios as jest.Mocked<typeof axios>;
const msg = "keep";
let wrapper: VueWrapper<any>;
describe("HelloWorld.vue", () => {
    beforeAll(() => {
        wrapper = shallowMount(HelloWorld, {
            props: { msg }
        });
    });
    it("renders props.msg when passed", () => {
        // console.log(wrapper.findComponent(Hello).props());
        expect(wrapper.text()).toMatch(msg);
    });
    it("should update the count when clicking button", async () => {
        await wrapper.get("button").trigger("click");
        expect(wrapper.get("button").text()).toBe("2");
    });
    it("should add todo when fill input and click addBtn", async () => {
        const todoCount = "add input";
        await wrapper.get("input").setValue(todoCount);
        expect(wrapper.get("input").element.value).toBe(todoCount);
        await wrapper.get(".addTodo").trigger("click");
        expect(wrapper.findAll("li")).toHaveLength(1);
        expect(wrapper.get("li").text()).toBe(todoCount);
        expect(wrapper.emitted()).toHaveProperty("send");
        const events = wrapper.emitted("send") as Array<[]>;
        console.log(events);
        expect(events[0]).toEqual([todoCount]);
    });
    //查看特定case
    it("should load user msg when click load btn", async () => {
        mockAxios.get.mockResolvedValueOnce({ data: { username: "keepzc" } });
        await wrapper.get(".loadUser").trigger("click");
        expect(mockAxios.get).toHaveBeenCalled();
        expect(wrapper.find(".loading").exists()).toBeTruthy();
        await flushPromises();
        //界面更新完毕
        expect(wrapper.find(".loading").exists()).toBeFalsy();
        expect(wrapper.get(".userName").text()).toBe("keepzc");
    });
    it.only("load error when promise reject err", async () => {
        mockAxios.get.mockRejectedValueOnce("error");
        await wrapper.get(".loadUser").trigger("click");
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        await flushPromises();
        //界面更新完毕
        expect(wrapper.find(".error").exists()).toBeTruthy();
    });
    afterEach(() => {
        mockAxios.get.mockReset();
    });
});
