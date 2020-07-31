const express = require('express');
const usersRepo = require('../../repositories/users');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
    requireEmail, 
    requirePassword, 
    requirePasswordConfirmation,
    requireEmailExists,
    requireValidPasswordForUser
} = require('./validator');
const { handleErrors } = require('./middlewares');


router.get('/signup',(req,res)=>{
    res.send(signupTemplate({req}));
});

router.post('/signup',[
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
],handleErrors(signupTemplate), async(req,res)=>{
    const {email, password, confirmation} = req.body;
    if(password !== confirmation){
        return res.send('The passwords dont match');
    }
    let user = await usersRepo.create({email, password});
    req.session.userId = user.id;
    res.redirect('/admin/products');
});
router.get('/signout',(req, res)=>{
    req.session = null;
    res.send('Logged out succesfull');
});
router.get('/signin',(req,res)=>{
    res.send(signinTemplate({req}));
});
router.post('/signin',[
    requireEmailExists,
    requireValidPasswordForUser
],handleErrors(signinTemplate),async(req,res)=>{
    const {email, password} = req.body;
    const user = await usersRepo.getOneBy({email});
    console.log(user);
    req.session.userId = user.id;
    res.redirect('/admin/products');
});

module.exports = router;