const express = require('express');
const bodyParser= require('body-parser')
const app = express();
app.use(express.static('public'));
const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost/';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.listen(3000, function() {
    console.log('listening on 3000')
  })
  MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/');
          })
          .catch(error => console.error(error))
      });
      app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
            .then(results => {
                res.render('index.ejs', { quotes: results })
            })
        .catch(error => console.error(error))
      });
      app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            { name: 'aa' },
            {
              $set: {
                name: req.body.name,
                quote: req.body.quote
              }
            },
            {
              upsert: true
            }
          )
            .then(result => {res.json('Success')})
            .catch(error => console.error(error))
      })
      app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne({ name: req.body.name })
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vadar's quote`)
          })
          .catch(error => console.error(error))
      })
  })
  .catch(error => console.error(error))
  
  
