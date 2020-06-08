
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
var cors = require('cors')

const Table_1 = process.env.Table_1;
const Table_2 = process.env.Table_2;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const dynamoDb2 = new AWS.DynamoDB.DocumentClient();

app.use(cors())
app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// Get User endpoint
app.get('/menu/:menuID', function (req, res) {
  const params = {
    TableName: Table_1,
    Key: {
      menuID: req.params.menuID,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    }
    if (result.Item) {
      const {menuID, path} = result.Item;
      res.json({ menuID, path });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
})

app.get('/jsons/:menuID', function (req, res) {
  const params = {
    TableName: Table_2,
    Key: {
      menuID: req.params.menuID,
    },
  }

  dynamoDb2.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    }
    if (result.Item) {
      const {menuID, jsons} = result.Item;
      res.json({ menuID, jsons });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
})

// Create User endpoint
app.post('/menu', function (req, res) {
  const { menuID, path } = req.body;
  if (typeof menuID !== 'string') {
    res.status(400).json({ error: '"menuID" must be a string' });
  } else if (typeof path !== 'string') {
    res.status(400).json({ error: '"path" must be a string' });
  }

  const params = {
    TableName: Table_1,
    Item: {
      menuID: menuID,
      path: path,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create menu' });
    }
    res.json({ menuID, path });
  });
})

app.post('/jsons', function (req, res) {
  const { menuID, jsons } = req.body;
  if (typeof menuID !== 'string') {
    res.status(400).json({ error: '"menuID" must be a string' });
  } else if (typeof jsons !== 'string') {
    res.status(400).json({ error: '"jsons" must be a string' });
  }

  const params = {
    TableName: Table_2,
    Item: {
      menuID: menuID,
      jsons: jsons,
    },
  };

  dynamoDb2.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create menu' });
    }
    res.json({ menuID, jsons });
  });
})

module.exports.handler = serverless(app);
app.listen(8000, function () {
  console.log('CORS-enabled web server listening on port 8000')
})
