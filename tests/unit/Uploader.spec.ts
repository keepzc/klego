import { shallowMount, VueWrapper, mount } from "@vue/test-utils";
import Uploader from "@/components/Uploader.vue";
import axios from "axios";
import flushPromises from "flush-promises";
jest.mock("axios");
//将mock断言为特定类型
const mockAxios = axios as jest.Mocked<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });
const mockComponent = {
    template: "<div><slot></slot></div>"
};
const mockComponents = {
    DeleteOutlined: mockComponent,
    LoadingOutlined: mockComponent,
    FileOutlined: mockComponent
};
const setInputValue = (input: HTMLInputElement) => {
    const files = [testFile] as any;
    Object.defineProperty(input, "files", {
        value: files,
        writable: false
    });
};
describe("Uploader Component", () => {
    beforeAll(() => {
        wrapper = shallowMount(Uploader, {
            props: {
                action: "test.url"
            },
            global: {
                stubs: mockComponents
            }
        });
    });
    it("basic layout before upload", () => {
        expect(wrapper.find("button").exists()).toBeTruthy();
        expect(wrapper.get("button").text()).toBe("点击上传");
        expect(wrapper.get("input").isVisible()).toBeFalsy();
    });

    it("upload process should work fine", async () => {
        //create e.target.files
        // create a file
        mockAxios.post.mockResolvedValueOnce({ status: "success" });
        const fileInput = wrapper.get("input").element as HTMLInputElement;
        setInputValue(fileInput);
        await wrapper.get("input").trigger("change");
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(wrapper.get("button").text()).toBe("正在上传");
        //button 为禁止
        expect(wrapper.get("button").attributes()).toHaveProperty("disabled");
        //列表长度修改并且有正确的class
        expect(wrapper.findAll("li").length).toBe(1);
        const firstItem = wrapper.get("li:first-child");
        expect(firstItem.classes()).toContain("upload-loading");
        await flushPromises();
        expect(wrapper.get("button").text()).toBe("点击上传");
        expect(firstItem.classes()).toContain("upload-success");
        expect(firstItem.get(".filename").text()).toBe(testFile.name);
    });
    it("should return error text when post is rejected", async () => {
        mockAxios.post.mockRejectedValueOnce({ error: "error" });
        await wrapper.get("input").trigger("change");
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(wrapper.get("button").text()).toBe("正在上传");
        await flushPromises();
        expect(wrapper.get("button").text()).toBe("点击上传");
        //列表长度增加，并且列表最后一项有正确的类名
        expect(wrapper.findAll("li").length).toBe(2);
        const lastItem = wrapper.get("li:last-child");
        expect(lastItem.classes()).toContain("upload-error");
        //点击列表右侧按钮删除
        await lastItem.get(".delete-icon").trigger("click");
        expect(wrapper.findAll("li").length).toBe(1);
    });
    it("should show correct interface when use custom slot", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: { url: "keep.url" } });
        mockAxios.post.mockResolvedValueOnce({ data: { url: "xyz.url" } });
        const wrapper = mount(Uploader, {
            props: {
                action: "test.url"
            },
            slots: {
                default: "<button>Custom button</button>",
                loading: '<div class="loading">custom loading</div>',
                uploaded: `<template #uploaded="{uploadedData}">
                <div class="custom-loaded">{{uploadedData.url}}</div>
                </template>`
            },
            global: {
                stubs: mockComponents
            }
        });
        expect(wrapper.get("button").text()).toBe("Custom button");
        const fileInput = wrapper.get("input").element as HTMLInputElement;
        setInputValue(fileInput);
        await wrapper.get("input").trigger("change");
        expect(wrapper.get(".loading").text()).toBe("custom loading");
        await flushPromises();
        expect(wrapper.get(".custom-loaded").text()).toBe("keep.url");
        await wrapper.get("input").trigger("change");
        expect(wrapper.get(".loading").text()).toBe("custom loading");
        await flushPromises();
        expect(wrapper.get(".custom-loaded").text()).toBe("xyz.url");
    });
    it("before upload check", async () => {
        const callback = jest.fn();
        mockAxios.post.mockResolvedValueOnce({ data: { url: "keep.url" } });
        const checkFileSize = (file: File) => {
            if (file.size > 2) {
                callback();
                return false;
            }
            return true;
        };
        const wrapper = shallowMount(Uploader, {
            props: {
                action: "test.url",
                beforeUpload: checkFileSize
            }
        });
        const fileInput = wrapper.get("input").element as HTMLInputElement;
        setInputValue(fileInput);
        await wrapper.get("input").trigger("change");
        expect(mockAxios.post).not.toHaveBeenCalled();
        expect(wrapper.findAll("li").length).toBe(0);
        expect(callback).toHaveBeenCalled();
    });
    it("before upload check using Promise", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: { url: "keep.url" } });
        const failedPromise = (file: File) => {
            return Promise.reject("wrong type");
        };
        const successPromise = (file: File) => {
            const newFile = new File([file], "new_name.docx", { type: file.type });
            return Promise.resolve(newFile);
        };
        const successPromiseWithWrongType = () => {
            return Promise.resolve("abcd");
        };

        const wrapper = shallowMount(Uploader, {
            props: {
                action: "test.url",
                beforeUpload: failedPromise
            }
        });
        const fileInput = wrapper.get("input").element as HTMLInputElement;
        setInputValue(fileInput);
        // fail promise with file
        await wrapper.get("input").trigger("change");
        await flushPromises();
        expect(mockAxios.post).not.toHaveBeenCalled();
        expect(wrapper.findAll("li").length).toBe(0);
        // success promise with wrong file
        await wrapper.setProps({ beforeUpload: successPromiseWithWrongType });
        await wrapper.get("input").trigger("change");
        await flushPromises();
        expect(mockAxios.post).not.toHaveBeenCalled();
        expect(wrapper.findAll("li").length).toBe(0);
        // success promise with file
        await wrapper.setProps({ beforeUpload: successPromise });
        await wrapper.get("input").trigger("change");
        await flushPromises();
        expect(mockAxios.post).toHaveBeenCalled();
        const firstItem = wrapper.get("li:first-child");
        expect(firstItem.classes()).toContain("upload-success");
        expect(firstItem.get(".filename").text()).toBe("new_name.docx");
    });
    it("test drag and drap function", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: { url: "keep.url" } });
        const wrapper = shallowMount(Uploader, {
            props: {
                action: "test.url",
                drag: true
            }
        });
        const uploadArea = wrapper.get(".upload-area");
        await uploadArea.trigger("dragover");
        expect(uploadArea.classes()).toContain("is-dragover");
        await uploadArea.trigger("dragleave");
        expect(uploadArea.classes()).not.toContain("is-dragover");
        await uploadArea.trigger("drop", { dataTransfer: { files: [testFile] } });
        expect(mockAxios.post).toHaveBeenCalled();
        await flushPromises();
        expect(wrapper.findAll("li").length).toBe(1);
    });
    it("testing manual uploaded process", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: { url: "keep.url" } });
        const wrapper = shallowMount(Uploader, {
            props: {
                action: "test.url",
                drag: true,
                autoUpload: false
            }
        });
        const fileInput = wrapper.get("input").element as HTMLInputElement;
        setInputValue(fileInput);
        await wrapper.get("input").trigger("change");
        expect(wrapper.findAll("li").length).toBe(1);
        const firstItem = wrapper.get("li:first-child");
        expect(firstItem.classes()).toContain("upload-ready");
        wrapper.vm.uploadFiles();
        expect(mockAxios.post).toHaveBeenCalled();
        await flushPromises();
        expect(firstItem.classes()).toContain("upload-success");
    });
    it("PictureList  mode should work fine", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: { url: "keep.url" } });
        window.URL.createObjectURL = jest.fn(() => {
            return "test.url";
        });
        const wrapper = mount(Uploader, {
            props: {
                action: "test.url",
                listType: "picture"
            }
        });
        expect(wrapper.get("ul").classes()).toContain("upload-list-picture");
        const fileInput = wrapper.get("input").element as HTMLInputElement;
        setInputValue(fileInput);
        await wrapper.get("input").trigger("change");
        await flushPromises();
        expect(wrapper.findAll("li").length).toBe(1);
        expect(wrapper.find("li:first-child img").exists()).toBeTruthy();
        const firstImg = wrapper.get("li:first-child img");
        expect(firstImg.attributes("src")).toEqual("test.url");
    });
    afterEach(() => {
        mockAxios.post.mockReset();
    });
});
