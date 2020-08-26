var nodemailer = require('nodemailer');

const { spawn } = require('child_process');
exports.index = (req, res) => {
  res.render('index', {
    title: 'Home'
  });
};

const Team = require('../models/Team');
const User = require('../models/User');
const Match = require('../models/Match');

exports.createTeam = (req, res) => {

  const team = new Team({
    name: req.body.teamName,
    player1: req.body.userId.trim(),
    player2: req.body.userId.trim()
  });

  team.save((err) => {
    if (err) { return next(err); }
    req.flash('success', { msg: `Laget ${req.body.teamName} är registrerat 👍` });
    res.redirect('/settings');
  });
};


exports.settings = (req, res) => {

  Team.find({ $or: [{ player1: req.user._id }, { player2: req.user._id }] }, (err, teams) => {
    if (err) { return next(err); }

    User.find({}, (err, users) => {
      if (err) { return next(err); }
      res.render('settings', {
        title: 'Settings',
        teams: teams,
        users: users
      });
    });
  });
};

exports.booking = (req, res) => {
  Team.find({}, (err, teams) => {
    if (err) { return next(err); }
    res.render('booking', {
      title: 'Bookings',
      teams: teams,
    });
  });
};

exports.challenge = (req, res) => {
  var data = {
    'team': {},
    'users': {}
  };
  var id = req.params.id;
  Team.findById(id, (err, team) => {
    if (err) { throw err; }
    data.team = team;

    if (team.player2.length > 0) {
      User.find({ $or: [{ '_id': team.player1 }, { '_id': team.player2 }] }, (err, users) => {
        if (err) { throw err; }
        data.users = users;
        res.json(data);
      });
    }
    else {
      User.findById(team.player1, (err, users) => {
        if (err) { throw err; }
        data.users = users;
        res.json(data);
      });
    }
  });
};

exports.sendChallengeEmail = (req, res) => {

  console.log("sendChallengeEmail");
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'padel.trappan@gmail.com',
      pass: 'Neroxrox5('
    }
  });

  var mailOptions = {
    from: 'padel.trappan@gmail.com',
    to: 'ola.anders.karlsson@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      req.flash('success', { msg: `📧Email om utmaning har skickats` });
      res.redirect('/booking');
    }
  });
}