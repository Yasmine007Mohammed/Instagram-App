import passport from 'passport';
import User from '../models/user.model.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/google/callback",
        passReqToCallback: true

    }, async (accessToken, refreshToken, profile, done) => {
        // try {
        //     const email = profile.emails[0].value;
        //     if(!email) return cb(new Error('No email found in Google profile'), null);

        //     let user = await User.findOne({ email })
        //     if(!user){
        //         user = await User.create({
        //             name: profile.displayName,
        //             email
        //         });
        //     }
        //     return cb(null, user);
        // } catch (err) {
        //     return cb(err);
        // }
        return done(null, profile);
    }
)
);

// Serializtion
passport.serializeUser((user, done) => {
    // done(null, user.id);
    done(null, user);
});

passport.deserializeUser(async (id, done) => {
    // try {
    //     const user = await User.findById(id);
    //     done(null, user);
    // } catch (err) {
    //     done(err, null);
    // }
    done(null, user);
})