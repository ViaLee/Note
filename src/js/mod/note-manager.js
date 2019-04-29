var Toast = require('./toast.js').Toast;   //提示组件
var Note = require('./note.js').Note;      //单个便签组件
var Event = require('mod/event.js');


var NoteManager = (function(){          //立即执行函数，加载已有note、添加note

  function load() {     //加载已有的note
    $.get('/api/notes')     //向接口发送请求
      .done(function(ret){
        console.log('加载已有note方法,成功,ret.data')
        console.log(ret.islogin)
        if(ret.status == 0 && ret.islogin === true ){       //0表示请求成功
          $.each(ret.data, function(article,value) { 
             //遍历响应的所有数据，分别创建成一个便签
              new Note({
                id: value.id,
                context: value.text,
                username: value.username,
                ifprivate: value.ifprivate
              });
          });
          Event.fire('waterfall');   //激活瀑布流布局
        }else if(ret.status == 0 && ret.islogin == false ){       //0表示请求成功
          $.each(ret.data, function(article,value) {
             //遍历响应的所有数据，分别创建成一个便签
             if(!value.ifprivate){
              console.log('成功') 
              new Note({
                id: value.id,
                context: value.text,
                username: value.username
              });
            }
          });

          Event.fire('waterfall');   //激活瀑布流布局
        }else{
          Toast(ret.errorMsg);    //否则显示错误
        }
      })
      .fail(function(){
        Toast('网络异常');   //请求失败，显示网络异常
      });


  }

  function add(){
    new Note();
  }

  return {
    load: load,
    add: add
  }

})();

module.exports.NoteManager = NoteManager