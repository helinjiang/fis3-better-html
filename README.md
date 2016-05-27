# fis3-better-html
基于fi3构建的静态网页最佳实践


## 目录结构

- pages：页面
- modules：项目级别的模块
- components：可复用的组件，与项目无关
- common：公共的资源，比如img等

每个page和module，都可以独立包含自己所属的html、css、js，通过构建，最终打包在一起。这样的好处是模块化开发。

一套优秀的构建实践

fis3 release
启动内置服务器进行预览；

fis3 server start --type node