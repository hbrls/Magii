import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';


@Controller('/roadmap')
export class HomeController {

  @Inject()
  ctx: Context;

  @Get('/actuator/health/readiness')
  async readiness() {
    return {
      code: 0,
      message: 'readiness',
    };
  }

  @Get('/actuator/health/liveness')
  async liveness() {
    return {
      code: 0,
      message: 'liveness',
    };
  }
}
