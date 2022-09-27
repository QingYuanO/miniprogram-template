import {
  defineConfig
} from "unocss";
import presetWeapp from 'unocss-preset-weapp'
import {
  defaultAttributes,
  defaultIgnoreNonValuedAttributes,
  transformerAttributify,
  transformerClass
} from 'unocss-preset-weapp/transformer'
export default defineConfig({
  presets: [
    presetWeapp(),
  ],
  transformers: [
    // options 见https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify({
      attributes: [...defaultAttributes]
    }),
    // options 见https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
})