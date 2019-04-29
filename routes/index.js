var express = require('express');
var router = express.Router();  
//路由器级中间件的工作方式与应用程序级中间件的工作方式相同，只不过它被绑定到一个实例express.Router()。

/* GET home page. */
router.get('/', function(req, res, next) {
  var data;
  if(req.session.user){   //如果用户存在，则状态为已登录，用户对应，通过data传出去
    data = {
      isLogin: true,
      user: req.session.user
    }
  }else{
    data = {
      isLogin: false     //否则状态为未登录
    }
  }
  console.log('index.js - data')
  console.log(data)   //{ isLogin: false }
  res.render('index', data);    //在app.js中配置的index是view/index.ejs，将data传到首页 
});

module.exports = router;
