require('less/note.less');

var Toast = require('./toast.js').Toast;
var Event = require('mod/event.js');

function Note(opts) {
  this.initOpts(opts);
  this.createNote();
  this.setStyle();
  this.bindEvent();
}
Note.prototype = {
  colors: [
    ['#ea9b35', '#efb04e'], // headColor, containerColor
    ['#dd598b', '#e672a2'],
    ['#eee34b', '#f2eb67'],
    ['#c24226', '#d15a39'],
    ['#c1c341', '#d0d25c'],
    ['#3f78c3', '#5591d2']
  ],

  defaultOpts: {    //页面中已有的note
    id: '',   //Note的 id
    ifprivate: false,
    $ct: $('#content').length > 0 ? $('#content') : $('body'),  //默认存放 Note 的容器
    context: 'input here'  //Note 的内容
  },

  initOpts: function (opts) {
    this.opts = $.extend({}, this.defaultOpts, opts || {});  //将两个或更多对象的内容合并到第一个对象
    if (this.opts.id) {
      this.id = this.opts.id;
      this.ifprivate = this.opts.ifprivate
    }
  },

  createNote: function () {     //contenteditable 使元素可编辑
    var tpl = '<div class="note">'
      + '<div class="note-head"><span class="username"></span><span class="ifprivate"></span><span class="delete">&times;</span></div>'
      + '<div class="note-ct" contenteditable="true"></div>'
      + '</div>';
    this.$note = $(tpl);
    this.$note.find('.note-ct').text(this.opts.context);
    this.$note.find('.username').text(this.opts.username);
    console.log(this.opts.ifprivate)
    if(this.opts.ifprivate === 0){
      this.$note.find('.ifprivate').text('公开');
    }else if(this.opts.ifprivate === 1){
      this.$note.find('.ifprivate').text('隐藏');
    }
    this.opts.$ct.append(this.$note);
    if (!this.id) this.$note.css('bottom', '10px');  //新增在左边底下

  },

  setStyle: function () {    //随机color
    var color = this.colors[Math.floor(Math.random() * 6)];
    this.$note.find('.note-head').css('background-color', color[0]);
    this.$note.find('.note-ct').css('background-color', color[1]);
  },

  setLayout: function () {
    var self = this;
    if (self.clk) {
      clearTimeout(self.clk);
    }
    self.clk = setTimeout(function () {    //更新瀑布流布局
      Event.fire('waterfall');
    }, 100);
  },

  bindEvent: function () {
    var self = this,
      ifprivate = this.opts.ifprivate,
      $note = this.$note,
      $noteHead = $note.find('.note-head'),
      $noteCt = $note.find('.note-ct'),
      $delete = $note.find('.delete');
      $ifprivate = $note.find('.ifprivate')
    $delete.on('click', function () {     //删除
      self.delete();
    })

    //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
    $noteCt.on('focus', function () {      //聚焦时将html内容写入对象中
      if ($noteCt.html() == 'input here') $noteCt.html('');
      $noteCt.data('before', $noteCt.html());
    }).on('blur paste', function () {      //失焦、粘贴时如果html内容与对象中的内容不一致，则写入
      if ($noteCt.data('before') != $noteCt.html()) {
        $noteCt.data('before', $noteCt.html());
        self.setLayout();     //内容更新高度随之改变，因此要重新加载瀑布流布局
        if (self.id) {
          self.edit($noteCt.html())      //向后台发送post请求，更新数据                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        } else {
          self.add($noteCt.html(), ifprivate)       //添加新的note
        }
      }
    });

    //点击公开更改私有状态
    $ifprivate.on('click', function (e) {
      console.log($(e.currentTarget).text())
      if ($(e.currentTarget).text() === '公开') {
        console.log('改隐藏')    //不可以这样改，这样改没有存在内存，刷新就恢复了，因此需要按后台值显示
        $(e.currentTarget).text('隐藏')
        ifprivate = !ifprivate
        self.editprivate(ifprivate)
      }else if ($(e.currentTarget).text() === '隐藏') {
        $(e.currentTarget).text('公开')
        ifprivate = !ifprivate
        self.editprivate(ifprivate)
      }
    })



    //设置笔记的移动
    $noteHead.on('mousedown', function (e) {
      var evtX = e.pageX - $note.offset().left,   //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
        evtY = e.pageY - $note.offset().top;
      $note.addClass('draggable').data('evtPos', { x: evtX, y: evtY }); //把事件到 dialog 边缘的距离保存下来
    }).on('mouseup', function () {
      $note.removeClass('draggable').removeData('pos');
    });

    $('body').on('mousemove', function (e) {
      $('.draggable').length && $('.draggable').offset({
        top: e.pageY - $('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
        left: e.pageX - $('.draggable').data('evtPos').x
      });
    });
  },

  edit: function (msg) {
    var self = this;
    $.post('/api/notes/edit', {
      id: this.id,
      note: msg
    }).done(function (ret) {
      if (ret.status === 0) {
        Toast('update success');
      } else {
        Toast(ret.errorMsg);
      }
    })
  },

  editprivate: function (ifprivate) {
    var self = this
    $.post('/api/notes/editprivate', {
      id: this.id,
      ifprivate: ifprivate
    }).done(function (ret) {
      if (ret.status === 0) {
        self.ifprivate = ret.ifprivate
        Toast('update success');
      } else {
        Toast(ret.errorMsg);
      }
    })
  },

  add: function (msg,ifprivate) {
    console.log('addd...');
    var self = this;
    $.post('/api/notes/add', { note: msg ,ifprivate: ifprivate})
      .done(function (ret) {
        if (ret.status === 0) {
          // Toast('add success');
          Toast('add success');
        } else {
          console.log('failed.....')
          self.$note.remove();
          Event.fire('waterfall')
          Toast(ret.errorMsg);
        }
      });
    //todo
  },

  delete: function () {
    var self = this;
    $.post('/api/notes/delete', { id: this.id })
      .done(function (ret) {
        if (ret.status === 0) {
          Toast('delete success');
          self.$note.remove();
          Event.fire('waterfall')
        } else {
          Toast(ret.errorMsg);
        }
      });
  }

};

module.exports.Note = Note;

