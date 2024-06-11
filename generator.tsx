/**
 * jsx
 */
// import { readFile } from "fs/promises";
// import React from "react";
// import { renderJSXToHTML } from "./utils";

// export async function htmlGenerator() {
//   const author = "YaYu";
//   const postContent = await readFile("./posts/hello.txt", "utf8");

//   // 直接使用了 JSX 语法，tsx 会帮助我们进行编译，我们就不需要引入 Webpack 和 Babel 来处理了，会被处理为一个对象
//   // 具体执行的时候，其实是一个对象
//   let jsx = (
//     <html>
//       <head>
//         <title>My blog</title>
//         <script src="https://cdn.tailwindcss.com"></script>
//       </head>
//       <body className="p-5">
//         <nav className="flex items-center justify-center gap-10 text-blue-600">
//           <a href="/">Home</a>
//         </nav>
//         <article className="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
//           {postContent}
//         </article>
//         <footer className="h-20 mt-5 flex-1 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
//           (c) {author}, {new Date().getFullYear()}
//         </footer>
//       </body>
//     </html>
//   );

//   return renderJSXToHTML(jsx);
// }

/**
 * 组件
 * 其实就是如果js对象是 函数 （组件） 就执行它取其返回的 jsx值
 */
// import { readFile } from "fs/promises";
// import React from "react";
// import { renderJSXToHTML } from "./utils";
// import { BlogPostPage } from "./components";

// export async function htmlGenerator() {
//   const author = "YaYu";
//   const postContent = await readFile("./posts/hello.txt", "utf8");
//   return renderJSXToHTML(
//     <BlogPostPage postContent={postContent} author={author} />
//   );
// }

/**
 * 路由
 */
// import { readFile, readdir } from "fs/promises";
// import React from "react";
// import { renderJSXToHTML } from "./utils";
// import { Layout, IndexPage, PostPage } from "./components";

// export async function htmlGenerator(url) {
//   const content = await readFile("./posts/hello.txt", "utf8");

//   // 根据路径去匹配组件
//   //
//   const page = await matchRoute(url);
//   return renderJSXToHTML(<Layout>{page}</Layout>);
// }

// //  当访问 / 的时候，应该导航至 IndexPage，当访问 /xxx 的时候，应该导航至 PostPage
// async function matchRoute(url) {
//   if (url.pathname === "/") {
//     const files = await readdir("./posts");
//     const slugs = files.map((file) => file.slice(0, file.lastIndexOf(".")));
//     const contents = await Promise.all(
//       slugs.map((slug) => readFile("./posts/" + slug + ".txt", "utf8"))
//     );
//     return <IndexPage slugs={slugs} contents={contents} />;
//   } else {
//     const slug = url.pathname.slice(1);
//     const content = await readFile("./posts/" + slug + ".txt", "utf8");
//     return <PostPage slug={slug} content={content} />;
//   }
// }

/**
 * 异步组件
 */
import React from "react";
import { renderJSXToHTML, renderJSXToClientJSX, stringifyJSX } from "./utils";
import { Layout, IndexPage, PostPage } from "./components";

export async function htmlGenerator(url) {
  let jsx = <Router url={url} />;
  let html = await renderJSXToHTML(jsx);
  // 获取当前页面的客户端 JSX 对象
  const clientJSX = await renderJSXToClientJSX(jsx);
  // 拼接到脚本代码中
  const clientJSXString = JSON.stringify(clientJSX, stringifyJSX);
  html += `<script>window.__INITIAL_CLIENT_JSX_STRING__ = `;
  html += JSON.stringify(clientJSXString).replace(/</g, "\\u003c");
  html += `</script>`;
  html += `
  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client?dev"
      }
    }
  </script>
  <script type="module" src="/client.js"></script>
`;
  return html;
}

export async function jsxGenerator(url) {
  let clientJSX = await renderJSXToClientJSX(<Router url={url} />);
  const clientJSXString = JSON.stringify(clientJSX, stringifyJSX);
  return clientJSXString;
}

function Router({ url }) {
  let page;
  if (url.pathname === "/") {
    page = <IndexPage />;
  } else {
    const slug = url.pathname.slice(1);
    page = <PostPage slug={slug} />;
  }
  return <Layout>{page}</Layout>;
}
