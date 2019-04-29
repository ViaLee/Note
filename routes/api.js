var express = require('express');
var router = express.Router();
var Note = require('../models/note')


/* GET users listing. */
router.get('/notes', function(req, res, next) {   
  //接受get请求后的操作,不能再这里同步获取数据操作数据，要先获取再操作
  var opts = {raw: true}   //返回数据库中的原始结果
  var islogin = false
  if(req.session && req.session.user){
    islogin = true
    opts.where = {username:req.session.user.username }  //查询uername的原始结果
  }
  console.log('/notes')

  Note.findAll(opts).then(function(notes) {
    console.log(notes)
    res.send({status: 0,islogin: islogin, data: notes});
  }).catch(function(){
    res.send({ status: 1,errorMsg: '数据库异常'});
  });

});

router.post('/notes/add', function(req, res, next) { 
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }
  if (!req.body.note) {
    return res.send({status: 2, errorMsg: '内容不能为空'});
  }

  var note = req.body.note;
  var username = req.session.user.username;
  var ifprivate = req.body.note.ifprivate
  Note.create({text: note, username: username, ifprivate: ifprivate}).then(function(){
    console.log('add ok')
    res.send({status: 0})
  }).catch(()=>{
    res.send({status: 1})
  })
});

router.post('/notes/editprivate', function(req, res, next) {   
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }
  var noteId = req.body.id;
  var ifprivate = req.body.ifprivate;
  var username = req.session.user.username;
  Note.update({ifprivate: ifprivate}, {where:{id: noteId, username: username}}).then(function(lists){
    console.log('修改成功')
    if(lists[0] === 0){
      return res.send({ status: 1,errorMsg: '你没有权限'});
    }
    res.send({status: 0, ifprivate: ifprivate})
  }).catch(function(e){
    res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
});

router.post('/notes/edit', function(req, res, next) {   
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }
  var noteId = req.body.id;
  var note = req.body.note;
  var username = req.session.user.username;
  Note.update({text: note}, {where:{id: noteId, username: username}}).then(function(lists){
    if(lists[0] === 0){
      return res.send({ status: 1,errorMsg: '你没有权限'});
    }
    res.send({status: 0})
  }).catch(function(e){
    res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
});

router.post('/notes/delete', function(req, res, next) {   
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }
  var noteId = req.body.id
  var username = req.session.user.username;

  Note.destroy({where:{id:noteId, username: username}}).then(function(deleteLen){
    if(deleteLen === 0){
      return res.send({ status: 1, errorMsg: '你没有权限'});
    }
    res.send({status: 0})
  }).catch(function(e){
    res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
});

module.exports = router;
