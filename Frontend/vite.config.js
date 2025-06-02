import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // hoặc 3000 nếu bạn dùng port khác
    proxy: {
      '/api': {
        target: 'https://localhost:7031', // hoặc http nếu backend không bật HTTPS
        changeOrigin: true,
        secure: false, // Bắt buộc nếu chứng chỉ backend là tự ký
      },
    },
  },
});
