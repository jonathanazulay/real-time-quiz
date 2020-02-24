const proxy = require("http-proxy-middleware")

module.exports = app => {
  app.use(proxy("/ws", {target: "http://localhost:1234", ws: true}))
}