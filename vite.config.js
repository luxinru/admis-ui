/*
 * @Author: xu0129 417990035@qq.com
 * @Date: 2022-12-16 12:41:09
 * @LastEditors: xu0129 417990035@qq.com
 * @LastEditTime: 2022-12-21 13:01:44
 * @FilePath: \admis-ui\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'
import {hash} from './src/utils/functions'
import pxtovw from 'postcss-px-to-viewport'

// 大屏自适应代码
const loder_pxtovw = pxtovw({
  //这里是设计稿宽度 自己修改
    viewportWidth: 1920,
    viewportUnit: 'vw'
  })

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: createVitePlugins(env, command === 'build'),
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `[name].` + hash + `.js`,
          chunkFileNames: `[name].` + hash + `.js`,
          assetFileNames: `[name].` + hash + `.[ext]`
        }
      }
    },
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // vite 相关配置  http://192.168.0.5:23161
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/dev-api': {
          // target: 'http://192.168.0.5:23161',
          //target: 'http://localhost:8010',
           target: 'http://weiapp.pw:23068',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, '')
        }
      }
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          },
          loder_pxtovw
        ]
      }
    }
  }
})
