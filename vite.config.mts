import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite';
import { defineConfig } from 'weapp-vite/config';

export default defineConfig({
  plugins: [
    // @ts-ignore
    uvwt({
      rem2rpx: true,
    }),
  ],
  weapp: {
    // weapp-vite options
    srcRoot: './miniprogram',
  },
});
