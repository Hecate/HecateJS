#!/usr/bin/env node

'use strict';

const request = require('request');
const prompt = require('prompt');
const auth = require('../util/get_auth');

/**
 * @class Webhooks
 * @public
 *
 * @see {@link https://github.com/mapbox/hecate#webhooks|Hecate Documentation}
 */
class Webhooks {
    /**
     * Create a new Webhooks Instance
     *
     * @param {Hecate} api parent hecate instance
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Print help documentation about the subcommand to stderr
     */
    help() {
        console.error();
        console.error('List, Create, Manage & Delete hecate webhooks');
        console.error();
        console.error('Usage: cli.js webhooks <subcommand>');
        console.error();
        console.error('<subcommand>:');
        console.error('    list     List webhooks currently active on the server');
        console.error('    get      Get a specific webhook');
        console.error('    create   Create a new webhook');
        console.error('    update   Update an existing webhook');
        console.error('    delete   Delete an existing webhook');
        console.error();
    }

    /**
     * Queries hecate /api/webhooks endpoint
     *
     * @param {!Object} options Options for making a request to the hecate /api/webhooks endpoint
     *
     * @param {function} cb (err, res) style callback function
     *
     * @returns {function} (err, res) style callback
     */
    list(options = {}, cb) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            cb = cli;

            options.output = process.stdout;

            return main();
        } else if (options.cli) {
            cb = cli;

            prompt.message = '$';
            prompt.start({
                stdout: process.stderr
            });

            let args = [];

            if (!self.api.user && self.api.auth_rules && self.api.auth_rules.webhooks.get !== 'public') {
                args = args.concat(auth(self.api.user));
            }

            prompt.get(args, (err, argv) => {
                prompt.stop();

                if (argv.hecate_username) {
                    self.api.user = {
                        username: argv.hecate_username,
                        password: argv.hecate_password
                    };
                }

                return main();
            });
        } else {
            return main();
        }

        /**
         * Once the options object is populated, make the API request
         * @private
         *
         * @returns {undefined}
         */
        function main() {
            request.get({
                json: true,
                url: new URL('/api/webhooks', self.api.url),
                auth: self.api.user
            }, (err, res) => {
                if (err) return cb(err);
                if (res.statusCode !== 200) return cb(new Error(JSON.stringify(res.body)));

                return cb(null, res.body);
            });
        }

        /**
         * If in CLI mode, write results to stdout
         * or throw any errors incurred
         *
         * @private
         *
         * @param {Error} err [optional] API Error
         * @param {Object} hooks list of webhooks
         *
         * @returns {undefined}
         */
        function cli(err, hooks) {
            if (err) throw err;

            console.log(JSON.stringify(hooks));
        }
    }

    /**
     * Get a specific webhook given the ID
     *
     * @param {!Object} options Options for making a request to the hecate /api/webhooks endpoint
     * @param {number} options.id ID of the webhook to retreive
     *
     * @param {function} cb (err, res) style callback function
     *
     * @returns {function} (err, res) style callback function
     */
    get(options = {}, cb) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            cb = cli;

            options.output = process.stdout;

            return main();
        } else if (options.cli) {
            cb = cli;

            prompt.message = '$';
            prompt.start({
                stdout: process.stderr
            });

            let args = [{
                name: 'id',
                message: 'Webhook ID',
                type: 'string',
                required: 'true',
                default: options.id
            }];

            if (!self.api.user && self.api.auth_rules && self.api.auth_rules.webhooks.get !== 'public') {
                args = args.concat(auth(self.api.user));
            }

            prompt.get(args, (err, argv) => {
                prompt.stop();

                if (argv.hecate_username) {
                    self.api.user = {
                        username: argv.hecate_username,
                        password: argv.hecate_password
                    };
                }

                options.id = argv.id;

                return main();
            });
        } else {
            return main();
        }

        /**
         * Once the options object is populated, make the API request
         * @private
         *
         * @returns {undefined}
         */
        function main() {
            if (!options.id) return cb(new Error('options.id required'));

            request({
                method: 'GET',
                url: new URL(`/api/webhooks/${options.id}`, self.api.url),
                auth: self.api.user
            }, (err, res) => {
                if (err) return cb(err);
                if (res.statusCode !== 200) return cb(new Error(res.body));

                return cb(null, JSON.parse(res.body));
            });
        }

        /**
         * If in CLI mode, write results to stdout
         * or throw any errors incurred
         *
         * @private
         *
         * @param {Error} err [optional] API Error
         * @param {Object} hook single webhook
         *
         * @returns {undefined}
         */
        function cli(err, hook) {
            if (err) throw err;

            console.log(JSON.stringify(hook));
        }
    }

    /**
     * Delete a specific webhook given the ID
     *
     * @param {!Object} options Options for making a request to the hecate /api/webhooks endpoint
     * @param {number} options.id ID of the webhook to delete
     *
     * @param {function} cb (err, res) style callback function
     *
     * @returns {function} (err, res) style callback function
     */
    delete(options = {}, cb) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            cb = cli;

            options.output = process.stdout;

            return main();
        } else if (options.cli) {
            cb = cli;

            prompt.message = '$';
            prompt.start({
                stdout: process.stderr
            });

            let args = [{
                name: 'id',
                message: 'Webhook ID',
                type: 'string',
                required: 'true',
                default: options.id
            }];

            if (!self.api.user && self.api.auth_rules && self.api.auth_rules.webhooks.set !== 'public') {
                args = args.concat(auth(self.api.user));
            }

            prompt.get(args, (err, argv) => {
                prompt.stop();

                if (argv.hecate_username) {
                    self.api.user = {
                        username: argv.hecate_username,
                        password: argv.hecate_password
                    };
                }

                options.id = argv.id;

                return main();
            });
        } else {
            return main();
        }

        /**
         * Once the options object is populated, make the API request
         * @private
         *
         * @returns {undefined}
         */
        function main() {
            if (!options.id) return cb(new Error('options.id required'));

            request({
                method: 'DELETE',
                url: new URL(`/api/webhooks/${options.id}`, self.api.url),
                auth: self.api.user
            }, (err, res) => {
                if (err) return cb(err);
                if (res.statusCode !== 200) return cb(new Error(res.body));

                return cb(null, true);
            });
        }

        /**
         * If in CLI mode, write results to stdout
         * or throw any errors incurred
         *
         * @private
         *
         * @param {Error} err [optional] API Error
         *
         * @returns {undefined}
         */
        function cli(err) {
            if (err) throw err;

            console.log(true);
        }
    }

    /**
     * Update a given webhook ID
     *
     * @param {!Object} options Options for making a request to the hecate /api/webhooks endpoint
     * @param {number} options.id ID of the webhook to update
     * @param {string} options.name Name of the webhook
     * @param {string} options.url URL of the webhook
     * @param {Array<string>} options.actions server actions the webhook should be fired on
     *
     * @param {function} cb (err, res) style callback function
     *
     * @returns {function} (err, res) style callback function
     */
    update(options = {}, cb) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            cb = cli;

            options.output = process.stdout;

            return main();
        } else if (options.cli) {
            cb = cli;

            prompt.message = '$';
            prompt.start({
                stdout: process.stderr
            });

            let args = [{
                name: 'id',
                message: 'Webhook ID',
                type: 'string',
                required: 'true',
                default: options.id
            },{
                name: 'name',
                message: 'Webhook Name',
                type: 'string',
                required: 'true',
                default: options.name
            },{
                name: 'url',
                message: 'Webhook URL',
                type: 'string',
                required: 'true',
                default: options.url
            },{
                name: 'actions',
                message: 'Webhook Actions (comma separated)',
                type: 'string',
                required: 'true',
                default: options.actions
            }];

            if (!self.api.user && self.api.auth_rules && self.api.auth_rules.webhooks.set !== 'public') {
                args = args.concat(auth(self.api.user));
            }

            prompt.get(args, (err, argv) => {
                prompt.stop();

                if (argv.hecate_username) {
                    self.api.user = {
                        username: argv.hecate_username,
                        password: argv.hecate_password
                    };
                }

                options.id = argv.id;
                options.name = argv.name;
                options.url = argv.url;
                options.actions = argv.actions.split(',');

                return main();
            });
        } else {
            return main();
        }

        /**
         * Once the options object is populated, make the API request
         * @private
         *
         * @returns {undefined}
         */
        function main() {
            if (!options.id) return cb(new Error('options.id required'));
            if (!options.name) return cb(new Error('options.name required'));
            if (!options.url) return cb(new Error('options.url required'));
            if (!options.actions) return cb(new Error('options.actions required'));

            request({
                method: 'POST',
                json: true,
                url: new URL(`/api/webhooks/${options.id}`, self.api.url),
                auth: self.api.user,
                body: {
                    name: options.name,
                    url: options.url,
                    actions: options.actions
                }
            }, (err, res) => {
                if (err) return cb(err);
                if (res.statusCode !== 200) return cb(new Error(res.body));

                return cb(null, true);
            });
        }

        /**
         * If in CLI mode, write results to stdout
         * or throw any errors incurred
         *
         * @private
         *
         * @param {Error} err [optional] API Error
         *
         * @returns {undefined}
         */
        function cli(err) {
            if (err) throw err;

            console.log(true);
        }
    }

    /**
     * Create a new webhook
     *
     * @param {!Object} options Options for making a request to the hecate /api/webhooks endpoint
     * @param {string} options.name Name of the webhook
     * @param {string} options.url URL of the webhook
     * @param {Array<string>} options.actions server actions the webhook should be fired on
     *
     * @param {function} cb (err, res) style callback function
     *
     * @returns {function} (err, res) style callback function
     */
    create(options = {}, cb) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            cb = cli;

            options.output = process.stdout;

            return main();
        } else if (options.cli) {
            cb = cli;

            prompt.message = '$';
            prompt.start({
                stdout: process.stderr
            });

            let args = [{
                name: 'name',
                message: 'Webhook Name',
                type: 'string',
                required: 'true',
                default: options.name
            },{
                name: 'url',
                message: 'Webhook URL',
                type: 'string',
                required: 'true',
                default: options.url
            },{
                name: 'actions',
                message: 'Webhook Actions (comma separated)',
                type: 'string',
                required: 'true',
                default: options.actions
            }];

            if (!self.api.user && self.api.auth_rules && self.api.auth_rules.webhooks.set !== 'public') {
                args = args.concat(auth(self.api.user));
            }

            prompt.get(args, (err, argv) => {
                prompt.stop();

                if (argv.hecate_username) {
                    self.api.user = {
                        username: argv.hecate_username,
                        password: argv.hecate_password
                    };
                }

                options.name = argv.name;
                options.url = argv.url;
                options.actions = argv.actions.split(',');

                return main();
            });
        } else {
            return main();
        }

        /**
         * Once the options object is populated, make the API request
         * @private
         *
         * @returns {undefined}
         */
        function main() {
            if (!options.name) return cb(new Error('options.name required'));
            if (!options.url) return cb(new Error('options.url required'));
            if (!options.actions) return cb(new Error('options.actions required'));

            request({
                method: 'POST',
                json: true,
                url: new URL('/api/webhooks', self.api.url),
                auth: self.api.user,
                body: {
                    name: options.name,
                    url: options.url,
                    actions: options.actions
                }
            }, (err, res) => {
                if (err) return cb(err);
                if (res.statusCode !== 200) return cb(new Error(res.body));

                return cb(null, true);
            });
        }

        /**
         * If in CLI mode, write results to stdout
         * or throw any errors incurred
         *
         * @private
         *
         * @param {Error} err [optional] API Error
         *
         * @returns {undefined}
         */
        function cli(err) {
            if (err) throw err;

            console.log(true);
        }
    }
}

module.exports = Webhooks;
