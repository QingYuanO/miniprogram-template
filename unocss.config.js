import { defineConfig } from "unocss";
import presetWeapp from "unocss-preset-weapp";
import { transformerClass } from "unocss-preset-weapp/transformer";
const include = [/\.wxml$/];

export default defineConfig({
  include: [/\.wxml$/],
  presets: [presetWeapp({})],
  transformers: [
    // options 见https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass({ include }),
  ],
});
