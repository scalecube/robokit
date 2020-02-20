class GithubPassport{

  constructor (passport) {
    const GitHubTokenStrategy = require('passport-github-token');

    passport.use(new GitHubTokenStrategy({
                     clientID: process.env.GITHUB_CLIENT_ID,
                     clientSecret: process.env.GITHUB_CLIENT_SECRET,
                     passReqToCallback: true
                   }, (req, accessToken, refreshToken, profile, next) => {
    //next(null, profile)
    next(null, profile)
  }))

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
  }
}
module.exports = GithubPassport