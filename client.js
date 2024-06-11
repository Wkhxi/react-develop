let currentPathName = window.location.pathname;

async function navigate(pathname) {
  currentPathName = pathname;
  const response = await fetch(pathname);
  const html = await response.text(); // 获取导航页面的 HTML

  console.log("navigate ===>", html);
  //   <html><head><title>My blog</title><script src="https://cdn.tailwindcss.com"></script></head><body class="p-5"><nav class="flex items-center justify-center gap-10 text-blue-600"><a href="/">Home</a></nav><input required="true" class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input><main><section><h1>Blog List:</h1><div><section><a class="text-blue-600" href="/hello">hello</a><article class="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">&lt;h1&gt;Hello World!&lt;/h1&gt;
  // </article></section></div></section></main><footer class="h-20 mt-5 flex-1 rounded-xl bg-cyan-500 text-white flex items-center justify-center">(c) YaYu, 2024</footer></body></html><script type="module" src="/client.js"></script>

  if (pathname === currentPathName) {
    const res = /<body(.*?)>/.exec(html); // 获取 body 标签内容
    const bodyStartIndex = res.index + res[0].length; // res[0] :  "<body class=\"p-5\">"
    const bodyEndIndex = html.lastIndexOf("</body>");
    const bodyHTML = html.slice(bodyStartIndex, bodyEndIndex);

    console.log("res ===>", res);
    console.log("bodyStartIndex ===>", bodyStartIndex);
    console.log("bodyEndIndex ===>", bodyEndIndex);
    console.log("bodyHTML ===>", bodyHTML);

    document.body.innerHTML = bodyHTML; // 替换 HTML
  }
}

window.addEventListener(
  "click",
  (e) => {
    // 忽略非 <a> 标签点击事件
    if (e.target.tagName !== "A") {
      return;
    }
    // 忽略 "open in a new tab".
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    // 忽略外部链接
    const href = e.target.getAttribute("href");
    if (!href.startsWith("/")) {
      return;
    }
    // 组件浏览器重新加载页面
    e.preventDefault();
    // 但是 URL 还是要更新

    // pushState() 方法并不会触发浏览器的页面刷新，所以它更适用于单页应用程序（SPA）等不依赖于传统页面加载模式的应用程序。
    // 不会导致页面加载或URL的改变，它只是改变了历史记录而已
    // state 状态对象
    // title
    // url 新的历史记录条目的 URL
    window.history.pushState(null, null, href);
    // 调用我们自己的导航逻辑
    navigate(href);
  },
  true
);

// 监听 popstate 事件，这个事件会在用户点击浏览器的前进或后退按钮时触发
window.addEventListener("popstate", () => {
  // 处理浏览器前进后退事件
  navigate(window.location.pathname);
});
