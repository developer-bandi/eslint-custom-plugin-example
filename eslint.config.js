"use strict";

const eslintPluginBandi = require("./eslint-plugin-bandi");

module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        plugins: {"bandi": eslintPluginBandi},
        rules: {
            "bandi/common-default-import-name": "error",
        },
    }
]