const express = require('express');
const router = express.Router();

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const keys = require('../../config/dbConfig');
const passport = require('passport');

// Load Input Validation
const validateLoginInput = require('../../validation/login');

// Load user model
const User = require('../../models/User');

// @route POST api/userAuth/login
// @desc Login userAuth/ returning JWT token
// @access Public

router.post('/login', (req, res) => {
    const {
        errors,
        isValid
    } = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find User by email
    User.findOne({
            email
        })
        .then(user => {
            // Check the user
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }

            // Check the password

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }; //Create JWT Payload

                        // Sign Token
                        jwt.sign(
                            payload,
                            keys.secretOrKey, {
                                expiresIn: 1800
                            },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            });
                    } else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                })

        });
});

module.exports = router;