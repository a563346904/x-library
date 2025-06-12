import { defineConfig } from 'vitepress';

// 确保 base 路径正确设置
const baseUrl = '/x-library/';

export default defineConfig({
  title: 'X Library',
  description: '统一的代码规范配置包',
  lang: 'zh-CN',
  base: baseUrl,

  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'logo-dark.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        href: 'logo-light.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)'
      }
    ]
  ],

  themeConfig: {
    logo: {
      light: 'logo-light.svg',
      dark: 'logo-dark.svg',
      width: 24,
      height: 24
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      {
        text: 'Lint 工具',
        items: [
          { text: 'ESLint', link: '/lint/eslint' },
          { text: 'Prettier', link: '/lint/prettier' },
          { text: 'Stylelint', link: '/lint/stylelint' },
          { text: 'Commitlint', link: '/lint/commitlint' }
        ]
      },
      {
        text: '实用工具',
        items: [
          { text: 'i18n', link: '/utils/i18n' },
          { text: 'Utils', link: '/utils/utils' }
        ]
      },
      {
        text: 'Vue3',
        items: [
          { text: '路由', link: '/vue3/router' },
          { text: '组件库', link: '/vue3/components' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [{ text: '介绍', link: '/guide/' }]
        }
      ],
      '/lint/': [
        {
          text: 'Lint 工具',
          items: [
            { text: '概览', link: '/lint/' },
            { text: 'ESLint', link: '/lint/eslint' },
            { text: 'Prettier', link: '/lint/prettier' },
            { text: 'Stylelint', link: '/lint/stylelint' },
            { text: 'Commitlint', link: '/lint/commitlint' }
          ]
        }
      ],
      '/utils/': [
        {
          text: '实用工具',
          items: [
            { text: '概览', link: '/utils/' },
            { text: 'i18n', link: '/utils/i18n' },
            { text: 'Utils', link: '/utils/utils' }
          ]
        }
      ],
      '/vue3/': [
        {
          text: 'Vue3',
          items: [
            { text: '概览', link: '/vue3/' },
            { text: '路由', link: '/vue3/router' },
            { text: '组件库', link: '/vue3/components' }
          ]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/a563346904/x-library' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 X Library'
    }
  }
});
