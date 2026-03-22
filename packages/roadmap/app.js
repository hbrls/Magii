const WebFramework = require('@midwayjs/koa').Framework;
const { Bootstrap } = require('@midwayjs/bootstrap');


module.exports = async () => {

  await Bootstrap.run();

  const container = Bootstrap.getApplicationContext();

  const framework = container.get(WebFramework);

  return framework.getApplication();

};
