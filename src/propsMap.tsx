import { VNode } from "vue";
import {AllFormProps} from './store/editor'
export interface PropToForm {
    component: string;
    extraProps?: { [key: string]: any };
    text?: string;
    subComponent?: string;
    options?: { text: string | VNode; value: any }[];
    initalTransform?: (v: any) => any;
    afterTransform?: (v: any) => any;
    valueProp?: string;
    eventName?: string;
}

export type PropsToForms = {
    [p in keyof AllFormProps]?: PropToForm;
};

const defaultHandler: PropToForm ={
    component: 'a-input',
    eventName: 'change',
    valueProp: 'value',
    initalTransform: (v: any) => v,
    afterTransform: (e: any) => e
}

const pxToNumberHandler: PropToForm = {
    component: 'a-input-number',
    initalTransform:(v: string) => v ? parseInt(v) : 0,
    afterTransform:(e: number) => e ? `${e}px` : ''
}

const fontFamilyArr = [
    { text: "宋体", value: '"SimSun","STSong"' },
    { text: "黑体", value: '"SimHei","STHeiti"' },
    { text: "楷体", value: '"KaiTi","STKaiti"' },
    { text: "仿宋", value: '"FangSong","STFangsong"' }
];
const fontFamilyOptions = fontFamilyArr.map((font) => {
    return {
        value: font.value,
        // text: h("span", { style: { fontFamily: font.value } }, font.text)
        text: (<span style={{ fontFamily: font.value }}>{font.text}</span>) as VNode
    };
});
export const mapPropsToForms: PropsToForms = {
    // textComponentProps
    text: {
        text: "文本",
        component: "a-textarea",
        extraProps: { row: 3 },
        afterTransform: (e: any) => e.target.value
    },
    fontSize: {
        text: "字号",
        ...pxToNumberHandler
    },
    lineHeight: {
        text: "行高",
        component: "a-slider",
        extraProps: { min: 0, max: 3, step: 0.1 },
        initalTransform: (v: string) => parseFloat(v),
        afterTransform: (e: number) => e.toString()
    },
    textAlign: {
        component: "a-radio-group",
        subComponent: "a-radio-button",
        text: "对齐",
        options: [
            { value: "left", text: "左" },
            { value: "center", text: "中" },
            { value: "right", text: "右" }
        ],
        afterTransform: (e: any) => e.target.value
    },
    fontFamily: {
        component: "a-select",
        subComponent: "a-select-option",
        text: "字体",
        options: [{ value: "", text: "无" }, ...fontFamilyOptions]
    },
    fontWeight: {
        component: 'icon-switch',
        initalTransform: (v: string) => v === 'bold',
        afterTransform: (e: boolean) => e ? 'bold' : 'normal',
        valueProp: 'checked',
        extraProps: { iconName: 'BoldOutlined', tip: '加粗' }
    },
    fontStyle: {
        component: 'icon-switch',
        initalTransform: (v: string) => v === 'italic',
        afterTransform: (e: boolean) => e ? 'italic' : 'normal',
        valueProp: 'checked',
        extraProps: { iconName: 'ItalicOutlined', tip: '斜体' }
    },
    textDecoration: {
        component: 'icon-switch',
        initalTransform: (v: string) => v === 'underline',
        afterTransform: (e: boolean) => e ? 'underline' : 'none',
        valueProp: 'checked',
        extraProps: { iconName: 'UnderlineOutlined', tip: '下划线' }
    },
    color: {
        component: "color-picker",
        text: "字体颜色"
    },
    backgroundColor:{
        component: 'color-picker',
        text: '背景颜色'
    },
    // imageComponentProps
    src: {
        component: 'image-processer'
    },
    // commonComponentProps - sizes
    width: {
        text: '宽度',
        ...pxToNumberHandler
    },
    height: {
        text: '高度',
        ...pxToNumberHandler
    },
    paddingLeft: {
        text: '左边距',
        ...pxToNumberHandler
    },
    paddingRight:{
        text: '右边距',
        ...pxToNumberHandler
    },
    paddingTop: {
        text: '上边距',
        ...pxToNumberHandler
    },
    paddingBottom: {
        text: '下边距',
        ...pxToNumberHandler
    },
    // commonComponentProps - border type
    borderStyle: {
        ...defaultHandler,
        component: 'a-select',
        subComponent: 'a-select-option',
        text: '边框类型',
        options: [
            { value: 'none', text: '无' },
            { value: 'solid', text: '实线' },
            { value: 'dashed', text: '破折线' },
            { value: 'dotted', text: '点状线' }
        ]
    },
    borderColor: {
        ...defaultHandler,
        component: 'color-picker',
        text: '边框颜色'
    },
    borderWidth: {
        ...pxToNumberHandler,
        component: 'a-slider',
        text: '边框宽度',
        extraProps:{ min: 0, max:20 }
    },
    borderRadius: {
        ...pxToNumberHandler,
        component: 'a-slider',
        text: '边框圆角',
        extraProps: { min: 0, max: 200 }
    },
    // commonComponentProps - opacity and boxShadow
    opacity: {
        component: 'a-slider',
        text: '透明度',
        initalTransform: (v: number) => v ? v * 100 : 100,
        afterTransform: (e: number) => (e / 100),
        extraProps: { min: 0, max: 100, reverse: true }
    },
    boxShadow: {
        component: 'shadow-picker'
    },
    // commonComponentProps - positions
    left: {
        ...pxToNumberHandler,
        text: 'X轴坐标'
    },
    top: {
        ...pxToNumberHandler,
        text: 'Y轴坐标'
    },
    // commonComponentProps - actions and urls
    // actions
    actionType: {
        ...defaultHandler,
        component: 'a-select',
        subComponent: 'a-select-option',
        text: '点击',
        options: [
          { value: '', text: '无' },
          { value: 'to', text: '跳转到 URL' }
        ]
    },
    url: {
        ...defaultHandler,
        afterTransform: (e: any) => e.target.value,
        text: '链接'
    },
    backgroundImage: {
        ...defaultHandler,
        component: 'background-processer',
        initalTransform: (v: string) => {
          if (v) {
            const reg = /\(["'](.+)["']\)/g
            const matches = reg.exec(v)
            if (matches && matches.length > 1) {
              console.log(matches)
              return matches[1]
            } else {
              return ''
            }
          } else {
            return ''
          }
        },
        afterTransform: (e: string) => e ? `url('${e}')` : ''
    }
};
