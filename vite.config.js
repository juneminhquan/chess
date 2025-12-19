import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/chess/', // Thay 'chess' bằng tên chính xác repo của bạn
})
