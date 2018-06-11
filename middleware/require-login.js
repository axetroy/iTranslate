export default function({ store, req, res, redirect }) {
  // 在服务端, 请求静态资源
  // 一律批准
  if (process.server && /^\/assets\//.test(req.url)) {
    return;
  }
  // 如果没有登陆的话
  // 给它跳转到404页面
  if (!store.state.user) {
    return redirect("/auth/login");
  }
}
