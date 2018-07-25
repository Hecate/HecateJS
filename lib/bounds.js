#!/usr/bin/env node

'use strict';

const request = require('request');
const prompt = require('prompt');
const auth = require('../util/get_auth');

class Query {
    constructor(api) {
        this.api = api;
    }

    help() {
        console.error('');
        console.error('Fetch raw data from the server using the bounds API');
        console.error('');
        console.error('usage: cli.js bounds');
        console.error('');
    }

    cli(options = {}) {
        if (!options) options = {};

        prompt.message = '$';
        prompt.start({
            stdout: process.stderr
        });

        let args = [{
            name: 'bound',
            message: 'bbox to download',
            required: true,
            type: 'string',
            default: options.bound
        }];

        if (this.api.auth_rules && this.api.auth_rules.feature.get !== 'public') {
            args = args.concat(auth(this.api.user));
        }

        prompt.get(args, (err, argv) => {
            if (err) throw err;

            prompt.stop();

            argv.output = process.stdout;

            this.get(argv, (err) => {
                if (err) throw err;
            });
        });
    }

    list(options = {}, cb) {
        if (!options) options = {};

        request({
            method: 'GET',
            json: true,
            url: `http://${this.api.url}:${this.api.port}/api/data/bounds`,
            auth: this.api.user
        }, (err, res) => {
            if (err) return cb(err);
            if (res.statusCode !== 200) return cb(new Error(res.body));

            return cb(null, res.body);
        });
    }

    main(options = {}, cb) {
        if (!options) options = {};

        if (!options.bound) return cb(new Error('options.bound required'));
        if (!options.output) return cb(new Error('options.output required'));

        request({
            method: 'GET',
            url: `http://${this.api.url}:${this.api.port}/api/data/bounds/${options.bound}`,
            auth: this.api.user
        }).pipe(options.output);
    }
}

module.exports = Query;
