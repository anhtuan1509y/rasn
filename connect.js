var pg  = require('pg');
var conec =  function(name){
 var config = {
    user: 'postgres',
    database: "'"+ name+"'",
    password: '123',
    host: 'localhost',
    port: 5432,
    max: 10,
  };
  var pool = new pg.Pool(config);
}
var findAll = function(nametable){
    pool.connect(function(err,client,done) {
        if(err){
          return console.log('erroe fetching',err);
        }
        client.query("SELECT * FROM "+ nametable + "",function(err, result) {
          done();
          if(err){
            return console.log('err query',err);
          }
          console.log(result.rows[0].ten);
        });
      });
}
module.exports.findAll = findAll;
module.exports.conec = conec;