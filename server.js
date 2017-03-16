const express = require('express');
const request = require('request');
const {mongoose} = require('./db/mongoose');
const {Search} = require('./models/search');

const basePath = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDp2TKGeZXK1CwHyvnKL315PNVqRm1R-R4&cx=001558228040141127646:sqmb_ua9b2w&searchType=image&num=10';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/search', (req, res) => {
  Search.find().then((results) => {
    let queries = [];
    let i = 0;
    while (i < 10 && i < results.length) {
      console.log('do thing');
      queries.push({
        term: results[i].term,
        when: results[i].when
      });
      i++;
    };

    res.send(queries);
  }).catch((e) => {
    res.status(400).send();
  });
})

app.get('/search/new', (req, res) => {
  let searchTerm = req.query.q;
  let offSet = req.query.offset || 1;

  let searchQuery = `${basePath}&q=${searchTerm}&start=${offSet}`;
  let searchTime = (new Date()).toJSON();

  request(searchQuery, (err, response, body) => {
    if (err) {
      return res.status(400).send();
    }

    // Send to DB
    let search = new Search({
      term: searchTerm,
      when: searchTime
    });

    search.save().then(() => {

    }, (e) => {
      console.log(`Error: ${e}`);
    });

    // Results in JSON
    let results = [];

    let items = JSON.parse(response.body).items;
    items.forEach((result) => {
      let filteredResult = {
        url: result.link,
        snippet: result.snippet,
        thumbnail: result.image.thumbnailLink,
        context: result.image.contextLink
      }
      results.push(filteredResult);
    });

    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`'Server started on port ${port}'`);
});
//&q=dogs&start=1
