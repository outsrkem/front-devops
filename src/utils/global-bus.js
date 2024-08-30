/**
 * 全局通信总线
 * 呼叫中心
 * 作用：让任何组件相互通信
 */

import Vue from 'vue'

export default new Vue()

// 假设a 要给b发送数据

// b 要注册事件
// import globalBus from '@/utils/global-bus'
// globalBus.$on('自定义事件名称',(myData)=>{
//   处理函数
// })

// a 发布通信事件
// import globalBus from '@/utils/global-bus'
// globalBus.$emit('自定义事件名称', 可选的数据会发送给上面的myData)
// 通信事件名称必须一致
