import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { webcrypto } from "crypto";

// Node.js 환경에 Web Crypto API 제공
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
