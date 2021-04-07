import { defineConfig } from 'umi';

export default defineConfig({
  base: '/fundaip',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
});
