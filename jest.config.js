module.exports = {
    preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
    //解决测试 lodash解决引入方法测试无法通过问题
    transformIgnorePatterns: ["/!node_modules\\/lodash-es/"]
};
