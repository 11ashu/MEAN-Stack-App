const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {
   
    router.post('/register', (req, res) => {
        if(!req.body.email){
            res.json({ success: false, message: 'You must provide an Email'});
        }else{
            if(!req.body.username){
                res.json({ success: false, message: 'You must provide an Username'});
            }else{
                if(!req.body.password){
                    res.json({ success: false, message: 'You must provide Password'});   
                }else{
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    user.save((err) => {
                        if(err) {
                            if(err.code === 11000){
                                res.json({ success: false, message: 'Username or e-mail already exists' });
                            }else{
                                if(err.errors){
                                    if(err.errors.email){
                                        res.json({ success: false, message: err.errors.email.message });
                                    }else{
                                        if(err.errors.username){
                                            res.json({ success: false, message: err.errors.username.message });  
                                        }else{
                                            if(err.errors.password){
                                                res.json({ success: false, message: err.errors.password.message });  
                                            }else{
                                                res.json({ success: false, message: err });
                                            }
                                        }
                                    }
                                }else{
                                    res.json({ success: false, message: 'Could not save user. Error: ', err });
                                }
                                
                            }
                        }else{
                            res.json({ success: true, message: 'Account Registered Successfully!!' });
                        }
                    });
                }
            }  
        }  
    });

    /* ============================================================
     Route to check if user's email is available for registration
    ============================================================ */
    router.get('/checkEmail/:email', (req, res) => {
        // Check if email was provided in paramaters
        if (!req.params.email) {
        res.json({ success: false, message: 'E-mail was not provided' }); // Return error
        } else {
        // Search for user's e-mail in database;
        User.findOne({ email: req.params.email }, (err, user) => {
            if (err) {
            res.json({ success: false, message: err }); // Return connection error
            } else {
            // Check if user's e-mail is taken
            if (user) {
                res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
            } else {
                res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
            }
            }
        });
        }
    });

    /* ===============================================================
     Route to check if user's username is available for registration
    =============================================================== */
    router.get('/checkUsername/:username', (req, res) => {
        // Check if username was provided in paramaters
        if (!req.params.username) {
        res.json({ success: false, message: 'Username was not provided' }); // Return error
        } else {
        // Look for username in database
        User.findOne({ username: req.params.username }, (err, user) => {
            // Check if connection error was found
            if (err) {
            res.json({ success: false, message: err }); // Return connection error
            } else {
            // Check if user's username was found
            if (user) {
                res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
            } else {
                res.json({ success: true, message: 'Username is available' }); // Return as vailable username
            }
            }
        });
        }
    });
    
    /* ===============================================================
     Route to Login
    =============================================================== */
    router.post('/login', (req, res) => {
        if(!req.body.username){
            res.json({ success: false, message: 'No Username was provided' });
        }else{
            if(!req.body.password){
                res.json({ success: false, message: 'No Password was provided' });
            }else{
                User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                    if(err) {
                        res.json({ success: false, message: err });
                    }else{
                        if(!user){
                            res.json({ success: false, message: 'Username not Found' });
                        }else{
                            const validPassword = user.comparePassword(req.body.password);
                            if(!validPassword){
                                res.json({ success: false, message: 'Invalid Password' });
                            }else{
                               const token = jwt.sign({ userId: user._id }, config.secret, {expiresIn: '24h'});

                                res.json({ success: true, message: 'Success!', token: token, user: {username: user.username} });
                            }
                        }
                    }
                });
            }
        }
    })
    
    /*====================================
    Route to get Profile Details
    ====================================*/
    
    router.use((req, res, next) => {
        const token = req.headers['authorization']; // Create token found in headers
        // Check if token was found in headers
        if (!token) {
          res.json({ success: false, message: 'No token provided' }); // Return error
        } else {
          // Verify the token is valid
          jwt.verify(token, config.secret, (err, decoded) => {
            // Check if error is expired or invalid
            if (err) {
              res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
            } else {
              req.decoded = decoded; // Create global variable to use in any request beyond
              next(); // Exit middleware
            }
          });
        }
      });

    router.get('/profile', (req, res) => {
       User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
           if(err) {
               res.json({ success: false, message: err });
           }else{
               if(!user){
                res.json({ success: false, message: 'User not found' });
               }else{
                   res.json({ success: true, user: user });
               }
           }
       });
    });


    return router;
}