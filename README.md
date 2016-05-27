# fis3-better-html
基于fi3构建，模块化开发简易纯静态站点的一种解决方案。

## 目录结构

- pages：页面
- modules：项目级别的模块
- components：可复用的组件，与项目无关
- common：公共的资源，比如img等
- static：静态资源

每个page和module，都可以独立包含自己所属的html、css、js，通过构建，最终打包在一起。这样的好处是模块化开发。

modules 和 components 的区别在于：

- modules 更侧重业务级别的模块，例如header\footer等，也包括数个 page 或 module 都会用到的，比如业务的报表组件等。它离开了这个项目就可能无法再复用了。
- components 则侧重于可复用的组件，例如弹出框、消息提示框等，再比如 React 和 Vue 都有自己的自定义 Web Components 的机制，那么它们的公共组件也应该放在 components 中（或者 web-components 中）。它能够在多个项目中进行复用。如果可能的话，也可以将其托管在 npm 中。

还有一些功能性的模块，业务和 utils 工具集等的还是放在 common 里面




## 使用
fis3 release
启动内置服务器进行预览；

fis3 server start