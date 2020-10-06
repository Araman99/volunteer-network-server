const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2cqf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/user/:id',(req,res) =>{
  res.send('hey there')
  console.log(req.params);
})



const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true  });
client.connect(err => {
  const collection = client.db(`volunteerNetwork`).collection("volunteerTask");
  const registered = client.db(`volunteerNetwork`).collection("registerVolunteer")
  
  app.get('/task', (req,res)=>{
    collection.find({}).limit(20)
    .toArray((error, documents)=>{
      res.send(documents)
    })
  })

  app.post('/submitForm', (req,res) => {
    registered.insertOne(req.body)
    .then(result => {
      console.log(res.send(result.insertedCount>0));
    })
  })

  app.get('/addedEvent',(req,res)=>{
    registered.find({email:req.headers.email})
    .toArray((error,documents)=>{
      res.send(documents)
      
    })
  })

  app.get('/allRegisteredEvent',(req,res)=>{
    registered.find({})
    .toArray((error,documents)=>{
      res.send(documents)
      
    })
  })

  app.delete('/cancelEvent',(req,res)=>{
    console.log(req.headers.id);
    registered.deleteOne({_id: ObjectID(req.headers.id)})
    .then(result=>{
      res.send(result.deletedCount>0)
    })
  })

  app.delete('/deleteEvent',(req,res)=>{
    registered.deleteOne({_id:ObjectID(req.headers.id)})
    .then(result=>{
      res.send(result.deletedCount>0)
    })
  })
  
});

const port = 5000;
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})