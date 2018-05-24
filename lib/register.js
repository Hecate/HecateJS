#! /usr/bin/env node

'use strict';

const request = require('request');
const prompt = require('prompt');

class Register {

    constructor(api) {
        this.api = api;
    }

    help() {
        console.error('');
        console.error('Register a new user account with the server');
        console.error('');
        console.error('usage: cli.js register');
        console.error('');
    }

    cli(options = {}) {
        prompt.message = '$';
        prompt.start();

        prompt.get([{
            name: 'username',
            message: 'Your Slack/Github Username',
            type: 'string',
            required: true,
            default: options.username
        }, {
            name: 'email',
            message: 'Your email address',
            type: 'string',
            required: true,
            default: options.email
        }, {
            name: 'password',
            message: 'secure password to be used at login',
            hidden: true,
            replace: '*',
            required: true,
            type: 'string'
        }], (err, res) => {
            prompt.stop();

            this.main({
                username: res.username,
                email: res.email,
                password: res.password
            }, (err) => {
                if (err) throw err;

                console.error('ok - created user');
            });
        });
    }

    main(options, cb) {
        if (!options.username) return cb(new Error('options.username required'));
        if (!options.password) return cb(new Error('options.password required'));
        if (!options.email) return cb(new Error('options.email required'));

        options.username = encodeURIComponent(options.username);
        options.password = encodeURIComponent(options.password);
        options.email = encodeURIComponent(options.email);

        request.get({
            url: `http://${this.api.url}:${this.api.port}/api/user/create?username=${options.username}&password=${options.password}&email=${options.email}`
        }, (err, res) => {
            if (err) return cb(err);
            if (res.statusCode !== 200) return cb(new Error(res.body));

            return cb(null, true);
        });
    }
}

module.exports = Register;