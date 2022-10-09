import { mount, VueWrapper } from "@vue/test-utils";
import UserProfile from "@/components/UserProfile.vue";
import { message } from "ant-design-vue";
import store from "@/store/index";
let wrapper: VueWrapper<any>;

jest.mock("ant-design-vue", () => ({
    message: {
        success: jest.fn()
    }
}));
const mockedRoutes: string[] = [];
jest.mock("vue-router", () => ({
    useRouter: () => ({
        push: (url: string) => mockedRoutes.push(url)
    })
}));

const mockComponents = {
    template: "<div><slot></slot></div>"
};
const mockComponents2 = {
    template: '<div><slot></slot><slot name="overlay"></slot></div>'
};
const globalComponents = {
    "a-button": mockComponents,
    "a-menu-item": mockComponents,
    "router-link": mockComponents,
    "a-menu": mockComponents,
    "a-dropdown": mockComponents2
};
describe("UserProfile.vue", () => {
    beforeAll(() => {
        //处理settimeout函数
        jest.useFakeTimers();
        wrapper = mount(UserProfile, {
            props: {
                user: { isLogin: false }
            },
            global: {
                components: globalComponents,
                provide: {
                    store
                }
            }
        });
    });
    it("should render button when login false", async () => {
        console.log(wrapper.html());
        expect(wrapper.get("div").text()).toBe("登录");
        await wrapper.get("div").trigger("click");
        expect(message.success).toHaveBeenCalled();
        expect(store.state.user.userName).toBe("keep");
    });
    it("should render username when login true", async () => {
        await wrapper.setProps({
            user: { isLogin: true, userName: "zc" }
        });
        console.log(wrapper.html());
        expect(wrapper.get(".user-profile-component").html()).toContain("zc");
        expect(wrapper.find(".user-profile-dropdown").exists()).toBeTruthy();
    });
    it("should call logout and show msg call router push timeout to home page", async () => {
        await wrapper.get(".user-profile-dropdown div").trigger("click");
        expect(store.state.user.isLogin).toBeFalsy();
        expect(message.success).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(mockedRoutes).toEqual(["/"]);
    });
    afterEach(() => {
        (message as jest.Mocked<typeof message>).success.mockReset();
    });
});
