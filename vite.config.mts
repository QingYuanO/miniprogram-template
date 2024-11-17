import path from 'node:path';
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite';
import { defineConfig } from 'weapp-vite/config';

export default defineConfig({
  plugins: [
    // @ts-ignore
    uvwt({
      rem2rpx: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  weapp: {
    // weapp-vite options
    srcRoot: './src',
    jsonAlias: {
      entries: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
  },
});
