import {
  defineConfig
} from "unocss";
import presetWeapp from 'unocss-preset-weapp'
import {
  transformerAttributify,
  transformerClass
} from 'unocss-preset-weapp/transformer'
export default defineConfig({
  include,
  presets: [
    presetWeapp(),
  ],
})