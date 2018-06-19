const resolve = require("path").resolve;

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: "iTranslate",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: "#3B8070" },
  router: {
    extendRoutes(routes) {
      routes.push({
        name: "custom",
        path: "*",
        component: resolve(__dirname, "pages/404.vue")
      });
      routes.push({
        name: "index",
        path: "/",
        component: resolve(__dirname, "pages/index.vue")
      });
    }
  },
  /*
  ** Build configuration
  */
  build: {
    vendor: ["axios", "moment", "lodash"],
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {},
    babel: {
      plugins: [
        [
          "component",
          [
            {
              libraryName: "element-ui",
              styleLibraryName: "~theme"
            }
          ]
        ]
      ]
    },
    postcss: [require("postcss-cssnext")()]
  },

  plugins: [
    { src: "~plugins/element-ui", ssr: true },
    { src: "~plugins/graphql", ssr: true }
  ],
  css: ["~assets/css/main.css"]
};
