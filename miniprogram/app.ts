import { createApp } from 'rubic'

createApp({
  setup(options, ctx) {
    console.log(options.path) //	启动小程序的路径 (代码包路径)
    console.log(options.scene) //	启动小程序的场景值
    console.log(options.query) //	启动小程序的 query 参数
    // ...
    return {
      appName: 'hello rubic',
    }
  },
})