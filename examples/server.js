const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const router = express.Router()

router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})
router.get('/base/get', function(req, res) {
  setTimeout(()=>{
    res.json(req.query);
  },2000);
})
router.get('/error/timeout', function(req, res) {
  setTimeout(()=>{
    res.json(req.query);
  },5000);
})
router.get('/error/get', function(req, res) {
  res.writeHead(500,{});
  res.end('');
})

router.post('/base/post', function(req, res) {
  res.json(req.body);
})
router.post('/base/formpost', function(req, res) {
  res.json(req.body);
})
regisetrExtendRouter();
function regisetrExtendRouter() {
  router.post('/extend/post', function(req, res) {
    res.json(req.body);
  });
  router.get('/extend/get', function(req, res) {
    res.json(req.query);
  });
  router.get('/extend/getUser',(req,res)=>{
    res.json({code:200,result:{
      name:'zs'
    }})
  });
}
router.get('/reject/get',(req,res)=>{
  setTimeout(()=>{
    res.json({code:200,result:{
      name:'zs'
    }})
  },5000);
});
app.use(router)
const port = process.env.PORT || 8081
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})