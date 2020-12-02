const express = require('express')
const { User } = require('../models');
const {mongoChecker, isMongoError} = require('./helpers/mongo_helpers')

const router = express.Router();
const log = console.log;

// Create logged in session for user
/*
Request body expects :
{
    "username": <username>
    "password": <password>
}
*/
router.post('/api/login', mongoChecker, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    log(`Log in requested for ${username}`);

    try {
        const user =  await User.findByUsernamePassword(username, password) 
        if (!user) {
                res.redirect('/login');
        } else {
            req.session.user = user._id; //need to put this into url parameter for each page
            req.session.username = user.username;
            req.session.isAdmin = user.isAdmin; //cookie keeps track of whether this is an admin for permission purposes
            res.redirect(`/home?user=${req.session.user}`) //pass user's ID into url parameter so it is known to client side
        }
    } catch (error) {
        if (isMongoError(error)) {
            res.status(500).redirect('/login');
        } else {
            log(error);
            res.status(400).redirect('/login');
        }
    }
});

//log user out
router.get('/api/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.redirect('/login')
        }
    })
})


module.exports = router;