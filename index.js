const path = require('path');
const express = require('express');
const hbs = require('hbs'); //module template engine
const bodyParser = require('body-parser'); //module middleware
const mysql = require('mysql'); //module database
const app = express();
 
//konfigurasi koneksi
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cinau_crudnode'
});
 
//connect ke database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public sebagai static folder untuk static file
app.use('/assets',express.static(__dirname + '/public'));
 
//route untuk homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM products";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});

app.get('/add',(req, res) => { res.render('product_add'); });
app.get('/edit/:productId(\\d+)',(req, res) => { 
	let data = {product_id: req.params.productId};
	let sql = "SELECT * FROM products WHERE ?";
	let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.render('product_edit',{
      results: results[0]
    });
  });
});

//route untuk insert data
app.post('/save',(req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  let sql = "INSERT INTO products SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});
 
//route untuk update data
app.post('/update/:productId(\\d+)',(req, res) => {
	let data = [{product_name: req.body.product_name, product_price: req.body.product_price},{product_id: req.params.productId}];
  let sql = "UPDATE products SET ? WHERE ?";
  let query = conn.query(sql, data, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});
 
//route untuk delete data
app.get('/delete/:productId(\\d+)',(req, res) => {
	let data = {product_id: req.params.productId};
  let sql = "DELETE FROM products WHERE ?";
  let query = conn.query(sql, data, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});
 
//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});