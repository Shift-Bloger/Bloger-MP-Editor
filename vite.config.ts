import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import dts from 'vite-plugin-dts'
import { rmSync } from 'fs'
import { visualizer } from 'rollup-plugin-visualizer'

// 自定义插件：构建完成后删除不需要的文件
const deleteFilesPlugin = () => {
  return {
    name: 'delete-files',
    closeBundle() {
      try {
        // 删除 facio.png 文件
        rmSync(resolve(__dirname, 'dist/facio.png'), { force: true });
        console.log('✅ 已删除 dist/facio.png');
      } catch (error) {
        // 文件不存在时忽略错误
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    deleteFilesPlugin(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8888,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'ant-design-vue']
        }
      }
    }
  }
})
