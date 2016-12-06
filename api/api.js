import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import * as actions from './actions/index';
import {mapUrl} from 'utils/url.js';
import PrettyError from 'pretty-error';
import connect from 'connect';
import sessionMongoose from 'session-mongoose';
import mongoose from 'mongoose';
import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import User from './models/user';
require('dotenv').config();

mongoose.Promise = Promise;

const pretty = new PrettyError();
const app = express();

mongoose.connect(config.mongoDB, {
  server: {
    socketOptions: { keepAlive: 1 }
  }
});
const MongoSessionStore = sessionMongoose(connect);
const sessionStore = new MongoSessionStore({url: config.mongoDB});

app.use(session({
  secret: 'chuhoangson',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 },
  store: sessionStore
}));
app.use(bodyParser.json());

// Auth
app.use(passport.initialize());
app.use(passport.session());
// -- Github
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ email: profile.emails[0].value }, (err, result) => {
    let user;
    if (!result) {
      // console.log(profile);
      user = new User({
        email: profile.emails[0].value,
        displayName: profile.displayName,
        avatarUrl: profile._json.avatar_url
      });
      return user.save()
        .then(() => done(null, user))
        .catch((error) => done(error));
    }
    return done(null, result);
  });
}
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  // console.log('deserializeUser');
  User.findById(id, (err, user) => {
    // console.log(id, user);
    done(err, user);
  });
});

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);


app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

  const {action, params} = mapUrl(actions, splittedUrlPath);

  if (action) {
    action(req, params)
      .then((result) => {
        if (result instanceof Function) {
          result(res);
        } else {
          res.json(result);
        }
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect);
        } else {
          console.error('API ERROR:', pretty.render(reason));
          res.status(reason.status || 500).json(reason);
        }
      });
  } else {
    res.status(404).end('NOT FOUND');
  }
});

if (config.apiPort) {
  app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
