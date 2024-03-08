import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
})

/*
EsLint:

eslint 
vite-plugin-eslint
in react we install some specific eslint rules: eslint-config-react-app 
 / --save-dev /
*/