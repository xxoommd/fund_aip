import { defineConfig } from 'umi';

export default defineConfig({
  base: '/fundaip/',
  publicPath: '/fundaip/',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
});
