// app/models/ticket.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TicketSchema   = new Schema({
  email: String,
  ticketValue: String,
  created_at: { type: Date, default: Date.now()}
});

module.exports = mongoose.model('Ticket', TicketSchema);