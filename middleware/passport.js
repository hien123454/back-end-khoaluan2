const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const { JWT_SECRET, auth } = require('../config');

const User = require('../models/User');

// Passport Google
passport.use(
  new GoogleStrategy(
    {
      clientID: auth.google.CLIENT_ID,
      clientSecret: auth.google.CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // check whether this current user exists in our database
        const user = await User.findOne({
          authGoogleID: profile.id,
          authType: 'google',
        });

        if (user) return done(null, user);

        // If new account
        const newUser = new User({
          authType: 'google',
          authGoogleID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          avatar: profile.photos[0].value,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        console.log('error ', error);
        done(error, false);
      }
    }
  )
);

// Passport Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: auth.facebook.CLIENT_ID,
      clientSecret: auth.facebook.CLIENT_SECRET,
      callbackURL: '/auth/facebook/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // check whether this current user exists in our database
        console.log(profile);
        const user = await User.findOne({
          authFacebookID: profile.id,
          authType: 'facebook',
        });
        if (user) return done(null, user);
        // If new account
        const newUser = new User({
          authType: 'facebook',
          authFacebookID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          avatar: profile.photos[0].value,
        });

        await newUser.save();

        done(null, newUser);
      } catch (error) {
        console.log('error ', error);
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
