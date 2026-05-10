import { Provide, Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';


@Provide()
@Controller('/')
export class ViewController {

  @Inject()
  ctx: Context;

  @Get('/roadmap')
  async index() {
    await this.ctx.render('index.html');
  }

  @Get('/roadmap/:appId/:planId')
  async roadmapDetail() {
    await this.ctx.render('index.html');
  }

  @Get('/roadmap-*')
  async indexWildcard() {
    await this.ctx.render('index.html');
  }

  @Get('/roadmap/web-starter-properties')
  async rsrc() {
    await this.ctx.render('umi-web-starter-properties.html');
  }
}
