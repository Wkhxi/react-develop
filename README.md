##### 1.

```
npm i tsx --save-dev

npm i express escape-html react react-dom --save

```

##### 状态保留

```
1. 拦截客户端跳转，实现客户端 JS 导航
      服务端拦截到 localhost:3000 会加载 <script type="module" src="/client.js"></script>
      /client.js 中实现客户端导航
      通过 window.history.pushState 修改页面栈历史记录
      替换 html 内容
2. 导航的时候，获取目标路由的 JSX 对象
3. 客户端获取返回的 JSX 对象调用 root.render 进行重新渲染


```
