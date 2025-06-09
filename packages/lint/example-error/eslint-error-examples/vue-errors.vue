<!--
Vue错误示例文件：
- 'vue/attribute-hyphenation': 'off' - 禁用属性连字符命名检查
- 'vue/v-on-event-hyphenation': 'off' - 禁用事件连字符命名检查
- 'vue/no-v-html': 'off' - 禁用v-html指令检查
- 'vue/no-useless-mustaches': 'off' - 禁用无用的花括号检查
- 'vue/v-bind-style': 'off' - 禁用v-bind样式检查
- 'vue/no-useless-v-bind': 'off' - 禁用无用的v-bind检查
- 'vue/prefer-separate-static-class': 'off' - 禁用分离静态class检查
- 'vue/no-multiple-objects-in-class': 'off' - 禁用class中多对象检查
- 'vue/no-static-inline-styles': 'off' - 禁用内联样式检查
- 'vue/prefer-define-options': 'off' - 禁用defineOptions检查
- 'vue/component-definition-name-casing': 'off' - 禁用组件名大小写检查
- 'vue/no-boolean-default': 'off' - 禁用布尔默认值检查
- 'vue/require-explicit-emits': 'off' - 禁用显式emits检查
- 'vue/order-in-components': 'off' - 禁用组件选项顺序检查
- 'vue/no-dupe-keys': 'off' - 禁用重复键检查
- 'vue/valid-define-props': 'off' - 禁用defineProps验证检查
- 'vue/no-ref-as-operand': 'off' - 禁用ref作为操作数检查
- 'vue/no-watch-after-await': 'off' - 禁用await后使用watch检查
- 'vue/custom-event-name-casing': 'off' - 禁用事件名大小写检查
- 'vue/require-macro-variable-name': 'off' - 禁用宏变量命名检查
- 'sort-imports': 'off' - 禁用导入排序检查
-->
<template>
  <!-- 组件名称应使用PascalCase -->
  <my-component></my-component>

  <!-- 属性应使用kebab-case而不是camelCase -->
  <custom-input myProp="value" @myEvent="handler"></custom-input>

  <!-- 使用v-html（安全风险） -->
  <div v-html="userContent"></div>

  <!-- 多余的花括号 -->
  <p>{{ 'Hello' }}</p>

  <!-- 多余的v-bind -->
  <div v-bind:class="'container'"></div>

  <!-- 重复的class对象 -->
  <div :class="[{ active: isActive }, { active: isActive }]"></div>

  <!-- 内联样式（应提取到CSS中） -->
  <div style="color: red; font-size: 16px;"></div>
</template>

<script>
// 组件名应该是多词的
export default {
  name: 'component',

  // Props定义应该使用类型
  props: {
    enabled: Boolean,
    // 布尔类型props默认应为false
    visible: {
      type: Boolean,
      default: true
    }
  },

  // 应该显式声明发出的事件
  methods: {
    updateValue(val) {
      this.$emit('update', val);
    },
    deleteItem(id) {
      this.$emit('delete', id);
    }
  },

  // 在setup中解构props（会丢失响应性）
  setup(props) {
    const { enabled, visible } = props;

    return {
      enabled,
      visible
    };
  }
}
</script>

<script setup>
// 使用ref作为操作数
const count = ref(0);
if (count > 0) {
  console.log('Count is positive');
}

// 在await后使用watch
async function fetchData() {
  await api.getData();
  watch(source, callback);
}

// 属性和事件命名不一致
defineEmits(['Update', 'Delete']);

// Props定义应该使用类型
defineProps({
  userName: String,
  userAge: Number
});
</script>

<style>
.component {
  color: blue;
}
</style>
