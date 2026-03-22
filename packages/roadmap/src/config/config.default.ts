import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';


export default (appInfo: MidwayAppInfo): MidwayConfig => {
  return {
    keys: 'magii-roadmap-secret-key',

    staticFile: {
      dirs: {
        default: {
          prefix: '/roadmap/rsrc',
          dir: 'public/rsrc',
        },
      }
    },
  };
};
