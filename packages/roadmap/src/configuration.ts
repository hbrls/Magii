import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as view from '@midwayjs/view-nunjucks';
import * as staticFile from '@midwayjs/static-file';
import * as webStarter from 'midway-web-starter';
import * as info from '@midwayjs/info';

import * as DefaultConfig from './config/config.default';
import * as LocalConfig from './config/config.local';
import * as PrdConfig from './config/config.prd';


@Configuration({
  imports: [
    koa,
    validate,
    view,
    staticFile,
    webStarter,
    { component: info, enabledEnvironment: [ 'local' ] },
  ],
  importConfigs: [
    {
      default: DefaultConfig,
      local: LocalConfig,
      prd: PrdConfig,
    }
  ],
})
export class ContainerLifeCycle {

  @App()
  app: koa.Application;

  async onReady() {
    // pass
  }
}
