const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = User.findOne({ emailId: profile?.emails?.[0]?.value });

        if (!user) {
          user = new User({
            googleId: profile?.id,
            emailId: profile?.emails?.[0]?.value,
            name: profile?.displayName,
          });
          user.save();
        }
      } catch (error) {}
    }
  )
);
