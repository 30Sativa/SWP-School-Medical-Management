import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // hoặc 3000 nếu bạn dùng port khác
    proxy: {
      '/api': {
        target: 'https://swp-school-medical-management.onrender.com', // Địa chỉ API production
        changeOrigin: true,
        secure: true, // Đảm bảo kết nối HTTPS
      },
    },
  },
});
