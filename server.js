/**
 * Created by timyork on 8/30/15.
 */
// server.js

// BASE SETUP
// =============================================================================
var mongoose   = require('mongoose');
var request = require('request');

mongoose.connect('gcvauser:Magg13m0@ds059712.mongolab.com:59712/gcvanalytics'); // connect to our database

var Ticket     = require('./app/models/ticket');

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9001;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /tickets
// ----------------------------------------------------
router.route('/tickets')

  // create a ticket (accessed at POST http://localhost:8080/api/tickets)
  .post(function(req, res) {

    var ticket = new Ticket();      // create a new instance of the Ticket model
    ticket.email = req.body.email;  // set the tickets email (comes from the request)

    var tableauUser = ticket.email;
    console.log(tableauUser);

    request.post({url:'http://70.35.203.217/trusted', form:{username:tableauUser,target_site:'GCVAnalytics'}}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }

      var trustedTicket = body;
      console.log(trustedTicket);

      ticket.ticketValue = trustedTicket;  // set the tickets email (comes from the request)
      //ticket.ticketValue = req.body.ticketValue;  // set the tickets email (comes from the request)

      // save the ticket and check for errors
      ticket.save(function(err) {
        if (err)
          res.send(err);

        res.send(trustedTicket);
      });
    });
  })

  .get(function(req, res) {
    Ticket.find(function(err, tickets) {
      if (err)
        res.send(err);

      res.json(tickets);
    });
  });

router.route('/tickets/:ticket_id')

  // get the ticket with that id (accessed at GET http://localhost:8080/api/tickets/:ticket_id)
  .get(function(req, res) {
    Ticket.findById(req.params.ticket_id, function(err, ticket) {
      if (err)
        res.send(err);
      res.json(ticket);
    });
  })

  // delete the ticket with this id (accessed at DELETE http://localhost:8080/api/tickets/:ticket_id)
  .delete(function(req, res) {
    Ticket.remove({
      _id: req.params.ticket_id
    }, function(err, ticket) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);