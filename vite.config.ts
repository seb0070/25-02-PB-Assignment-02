import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/pb-assignment-02-react/', // 👉 레포 이름 정확히!
});
