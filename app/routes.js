// app/routes.js
module.exports = function(app, passport) {
    //
    // home page
    //
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
    
    //
    // login
    //
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    
    // process the login form
    app.post('login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to signup page if there is an err
        failureFlash : true // allow flash messages
    }));
    
    //
    // signup
    //
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an err
        failureFlash : true // allow flash msgs
    }));
    
    //
    // profile section
    //
    // we want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user from sess and pass to template
        });
    });
    
    //
    // logout
    //
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    // if user is auth in the sess, carry on
    if (req.isAuthenticated())
        return next();
    
    // if they aren't, redirect to home page
    res.redirect('/');
};
