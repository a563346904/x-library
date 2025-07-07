declare module '~virtual-routes' {
  import type { RouteRecordRaw } from 'vue-router';
  const routes: RouteRecordRaw[];
  export default routes;
}

declare global {
  function definePageMeta(meta: {
    layout?: string | false;
    name?: string;
    path?: string;
    redirect?: string;
    alias?: string | string[];
    meta?: Record<string, any>;
  }): void;
}
