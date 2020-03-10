const passport = require('passport/lib')
const GitHubStrategy = require('passport-github').Strategy
const expressAccessToken = require('express-access-token');
const accessTokens = []

class GithubPassport {

  constructor () {

    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback'
    }, (req, accessToken, refreshToken, profile, next) => {
      next(null, profile)
    }))

    passport.serializeUser(function (user, cb) {
      cb(null, user)
    })

    passport.deserializeUser(function (obj, cb) {
      cb(null, obj)
    })
    this.passport = passport
  }

  authenticate (opt) {
    if (opt)
      return passport.authenticate('github', opt)
    else
      return passport.authenticate('github')
  }

  isAuthenticated (req, res, next) {
    let session = req.cookies['session']
    const authorized = accessTokens.includes(session);
    if(!authorized) {
      return res.status(403).send('Forbidden');
    }else{
      next();
    }
  };

  approve (session) {
    accessTokens.push(session)
  }
}

module.exports = new GithubPassport()