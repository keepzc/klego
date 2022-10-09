import { shallowMount, VueWrapper, mount } from "@vue/test-utils";
import Uploade from "@/components/Uploade.vue";
import axios from "axios";
import flushPromises from "flush-promises";
jest.mock("axios");
//将mock断言为特定类型
const mockAxios = axios as jest.Mocked<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });

describe("Uploade Component", () => {
    beforeAll(() => {
        wrapper = shallowMount(Uploade, {
            props: {
                action: "test.url"
            }
        });
    });
    it("basic layout before uploading", () => {
        expect(wrapper.find("button").exists()).toBeTruthy();
        expect(wrapper.get("button span").text()).toBe("点击上传");
        expect(wrapper.get("input").isVisible()).toBeFalsy();
    });
    it("upload process should work fine", async() => {
        mockAxios.post.mockResolvedValueOnce({ status: "success" });
        const fileInput = wrapper.get('input').element as HTMLInputElement
        const files = [testFile] as any
        Object.defineProperty(fileInput, 'files', {
            value:files,
            writable:false
        })
        await wrapper.get('input').trigger('change')
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(wrapper.get("button span").text()).toBe("正在上传");
        await flushPromises()
        expect(wrapper.get('button span').text()).toBe('上传成功')
    })
    it("should return error text when post is rejected", async() => {
        mockAxios.post.mockRejectedValueOnce({ error: "error" });
        await wrapper.get("input").trigger("change");
        expect(mockAxios.post).toHaveBeenCalledTimes(2);
        expect(wrapper.get("button span").text()).toBe("正在上传");
        await flushPromises()
        expect(wrapper.get('button span').text()).toBe('上传失败')
    })
});
