const path = require('path');
const Config = require('webpack-chain');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = new Config();

config.mode(isProduction ? 'production' : 'development');

config.entry('umi')
  .add('./src/index.js')
  .end();

config.output
  .path(path.resolve('./.dist/roadmap/rsrc/dist'))
  .filename('[name]-[contenthash:5].js')
  .publicPath('/roadmap/rsrc/dist/');

config.resolve.extensions
  .add('.js')
  .add('.jsx')
  .add('.json')
  .add('.tsx');


config.module
	.rule('js')
		.test(/\.(js|jsx|ts|tsx)$/)
    .exclude.add(/node_modules/).end();
config.module
  .rule('js')
    .use('babel-loader').loader('babel-loader');


// CSS rule for local CSS files (with PostCSS/Tailwind processing)
config.module
  .rule('css')
    .test(/\.css$/)
    .exclude.add(/node_modules/).end();
config.module
  .rule('css')
    .use('style-loader').loader('style-loader');
config.module
  .rule('css')
    .use('css-loader').loader('css-loader');
config.module
  .rule('css')
    .use('postcss-loader').loader('postcss-loader')
    .options({
      postcssOptions: {
        plugins: [
          'postcss-preset-env',
          'tailwindcss',
        ]
      },
    });

// YAML rule
config.module
  .rule('yaml')
    .test(/\.ya?ml$/)
    .use('yaml-loader').loader('yaml-loader');

// CSS rule for external packages (node_modules) - no PostCSS processing
config.module
  .rule('vendor-css')
    .test(/\.css$/)
    .include.add(/node_modules/).end();
config.module
  .rule('vendor-css')
    .use('style-loader').loader('style-loader');
config.module
  .rule('vendor-css')
    .use('css-loader').loader('css-loader');


config.optimization.set('chunkIds', 'named');

// config.optimization.set('runtimeChunk', true);
config.optimization.set('splitChunks', {
  chunks: 'async',
  // minSize: 0,
  cacheGroups: {
    default: false,
    defaultVendors: false,
    react: {
      name: 'vendors-react',
      chunks: 'initial',
      minChunks: 1,
      test: /[\\/]node_modules[\\/](axios|react|react-dom)[\\/]/,
      priority: -10,
    },
  }
});

config.optimization.set('minimize', isProduction);

config.plugin('html-webpack-plugin').use(HtmlWebpackPlugin, [{
  template: './src/document.html',
  filename: path.resolve(__dirname, './.dist/roadmap/index.html'),
  inject: 'body',
}]);

// config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin).init(Plugin => new Plugin());

const conf = config.toConfig();

// 添加 devServer 配置（webpack-chain 不完全支持 devServer 所有选项）
conf.devServer = {
  port: 3000,
  open: false,
  hot: true,
  // 用 static 直接映射 .dist 目录
  static: [
    {
      directory: path.resolve('./.dist/roadmap'),
      publicPath: '/roadmap',
      serveIndex: false,
    },
  ],
  // 将构建产物写入磁盘，确保 dev 和 build 使用相同的目录结构
  devMiddleware: {
    writeToDisk: true,
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
  },
  historyApiFallback: {
    rewrites: [
      { from: /^\/roadmap\/([^/]+)\/([^/]+)$/, to: '/roadmap/index.html' },
      { from: /./, to: '/roadmap/index.html' },
    ],
  },
};
// console.log(conf);

module.exports = conf;
