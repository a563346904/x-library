import DefaultTheme from 'vitepress/theme';
import './custom.css';
import { nextTick } from 'vue';

export default {
  ...DefaultTheme,
  enhanceApp({ app: _app, router: _router }) {
    // 在应用挂载后添加主题切换监听器
    if (typeof window !== 'undefined') {
      // 添加过渡类到 html 元素
      const addTransitionClass = () => {
        document.documentElement.style.setProperty('transition', 'color-scheme 0.5s ease');
      };

      // 监听主题切换
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target as HTMLElement;
            if (target === document.documentElement) {
              // 在主题切换时触发过渡
              addTransitionClass();
            }
          }
        });
      });

      // 开始观察 html 元素的 class 变化
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });

      // 初始化过渡效果
      nextTick(() => {
        addTransitionClass();
      });
    }
  }
};
