require('less/index.less');

var NoteManager = require('mod/note-manager.js').NoteManager;
var Event = require('mod/event.js');
var WaterFall = require('mod/waterfall.js');
console.log('/app/index.js加载所有note')
NoteManager.load();

$('.add-note').on('click', function() {
  console.log('app/index.js add事件')
  NoteManager.add();
})

Event.on('waterfall', function(){
  WaterFall.init($('#content'));
})