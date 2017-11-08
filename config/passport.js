// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to our app
module.exports = function(passport) {
    //
    // passport session setup
    //
    // required for persistent login sess
    // passport needs ability to serialize and deserialize users out of sess
    
    //used to serialize the user for the sess
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    //
    // local login
    //
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with
        // email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
        // passReqToCallback allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // callback with email and password from our form
        
        // find a user whose email is the same as the form's email
        // we are cheking to see if the user trying to login already exists
        User.findOne({ 'local.email' : email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);
            
            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'no user found'));
            
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'incorrect password'));
            
            // if all is well, return the successful user
            return done(null, user);
        });
    }));
    
    //
    // local signup
    //
    
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override
        // with e-mail
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire req to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne won't fire unless data is sent back
        process.nextTick(function() {
            // find a user whose email is the same as the forms' email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' : email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);
                // check to see if there's already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'that email is already taken'))
                } else {
                    
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();
                    
                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    
                    // save the user
                    newUser.save(function(err){
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};
