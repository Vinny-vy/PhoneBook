const mysql = require('mysql');
const express = require('express');
const ejs = require('ejs'); 
var app = express();
const bodyparser = require('body-parser');
const path = require('path');

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'mysql',
    password: 'root',
    database: 'phone_book'
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB connection succeded!');
    else
    console.log("DB connection failed /n Error : "+JSON.stringify(err,undefined,2));
});


app.set('views',path.join(__dirname,'view'));
app.set('view engine','ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));


//Read every contact
app.get('/',(req,res)=>{
    mysqlConnection.query('SELECT * FROM phonebook',(err,rows,fields)=>{
       if(!err)
       res.render('allContact',{
           title: 'COMPLETE ... PHONE-BOOK !..',
           phonebook: rows
       });
       //res.send(rows);
       else    
       console.log(err);
    }
    )
});

app.listen(3006,()=>{console.log('Express server is running on port no : 3006');
});



//add new contact
app.get('/add',(req,res)=>{
res.render("add-contact",{
 title: 'Phone-book'
})    

});
//Insertion
app.post('/save',(req,res) => {
    let data={name:req.body.name, email_id:req.body.email_id, phone_number:req.body.phone_number};
    let sql = "INSERT INTO phonebook SET ?";
    let query= mysqlConnection.query(sql,data,(err,results) => {
        if(err) throw err;
        else
        res.redirect('/');
    });
});

app.get('/edit/:name',(req,res) =>{
  /*  const namee=req.params.name;
    let sql = 'SELECT * FROM phonebook WHERE name = ${namee}';
    let query = mysqlConnection.query(sql,(err,results) => {*/
        mysqlConnection.query('DELETE FROM phonebook WHERE name = ?',[req.params.name],(err,rows,fields)=>{
        if(err) throw err;
        res.render('update-contact',{
            title: 'Editing ..',
            phonebook: rows
            //console.log("alright!")
        });
    });
});
app.post('update',(req,res)=>{
    let data={name: req.body.name, email_id: req.body.email_id, phone_number: req.body.phone_number};
    const namee=req.body.name;
    let sql= "update phonebook SET name='"+req.body.name+"',email_id='"+req.body.email_id +"', phone_number='"+req.body.phone_number+"' where namee="+name;
    let query=mysqlConnection.query(sql,(err,results) => {
        if(err) throw err;
        res.redirect('/');
    });
});
app.delete('/phonebookk/:name',(req,res)=>{
    mysqlConnection.query('DELETE FROM phonebook WHERE name = ?',[req.params.name],(err,rows,fields)=>{
       if(!err)
       res.send("deleted successfully!");
       else    
       console.log(err);
    }
    )
});
