#! /usr/bin/env node

'use strict';

const request = require('request');
const prompt = require('prompt');

class Auth {
    constructor(api) {
        this.api = api;
    }

    help() {
        console.error('');
        console.error('Fetch authentication settings that the server uses to allow or deny specific api endpoints');
        console.error('');
        console.error('usage: cli.js auth');
        console.error('');
    }

    cli(options) {
        this.main(options, (err, res) => {
            if (err) throw err;

            console.log(JSON.stringify(res, null, 4));
        });
    }

    main(options, cb) {
        request.get({
            json: true,
            url: `http://${this.api.url}:${this.api.port}/api/auth`
        }, (err, res) => {
            if (err) return cb(err);

            if (res.statusCode === 404) return cb(new Error('404: Could not obtain auth list'));
            if (res.statusCode !== 200) return cb(new Error(res.body));

            return cb(null, res.body);
        });
    }
}

module.exports = Auth;