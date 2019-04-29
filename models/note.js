var Sequelize = require('sequelize');
var path = require('path');

var sequelize = new Sequelize(undefined,undefined, undefined, {
  host: 'localhost',
  dialect: 'sqlite',

  // SQLite only
  storage: path.join(__dirname, '../database/database.sqlite') 
  // storage: '../database/database.sqlite' 必须进入目录执行，否则找不到文件，所以使用path比较好
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


var Note = sequelize.define('note', {
    text: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    ifprivate: {
      type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true
    }
  });

  Note.sync()   //如果Note表不存在，则创建

  //异步操作表

  //Note.drop();  //将表删除
//Note.sync({force: true})    force:true 强制新建
// // force: true will drop the table if it already exists
// Note.sync({force: true}).then(function () {
//   // Table created
//   return Note.create({
//     text: 'hello world'
//   });
// });

// Note.create({     //创建数据
//   text: 'haha'
// })

// Note.destroy({where:{text:'haha'}}, function(){  //删除haha这条数据
//   console.log('destroy...')
//   console.log(arguments)
// })
// Note.findAll({raw: true}).then(function(articles) {  //查询
//   console.log(articles)
// })

module.exports = Note;