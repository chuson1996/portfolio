import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import User from './models/user';
import config from '../src/config';
import SessionCode from './models/sessionCode';
import randomString from 'randomstring';

export default function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  // -- Github
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${config.domain}/api/auth/github/callback`
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

  app.get('/auth/github', (req, res, next) => {
    passport.authenticate('github', {
      scope: [ 'user:email' ],
      state: req.query.redirectUrl
    })(req, res, next);
  });

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      if (req.query.state) {
        // res.redirect('/frodevchrext?accessToken=somethinghere');
        const sessionCode = randomString.generate(10);
        new SessionCode({
          user: req.user._id,
          activated: false,
          code: sessionCode
        }).save()
          .then(() => {
            res.redirect(`${req.query.state}?code=${sessionCode}`);
          });
        return;
      }
      res.redirect('/');
    }
  );
}
