import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // 获取当前构建的base路径
  const getBase = () => {
    const BUILD_TYPE = process.env.BUILD_TYPE || 'commission'
    
    const baseMap: Record<string, string> = {
      'commission': '/mfe/commission/1/',
      'task': '/mfe/task/1/',
      'qc': '/mfe/qc/1/'
    }
    
    return baseMap[BUILD_TYPE]
  }

  return {
    base: getBase(),
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      fs: {
        strict: false
      },
      proxy: {
        '/api': {
          target: 'http://47.94.230.110/index.php/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
