#!/usr/bin/env node

const fs = require('fs');
const _ = require('lodash');

const argv = require('minimist')(process.argv.slice(2));

function normalizeClass(string) {
    return _.startCase(_.camelCase(string)).replace(/ /g, '');
}

const [sourceDirName, targetDirName] = argv._
const srcDir = process.cwd() + '/src/';
const sourceDir = srcDir + sourceDirName;
const targetDir = srcDir + targetDirName;

try {
    fs.mkdirSync(targetDir)
} catch (e) {
}

const files = fs.readdirSync(sourceDir)

files.map((filename) => {
    const code = fs.readFileSync(sourceDir + '/' + filename, 'utf8');

    const newCode = code
        .replaceAll(sourceDirName, targetDirName)
        .replaceAll(normalizeClass(sourceDirName), normalizeClass(targetDirName))

    fs.writeFileSync(targetDir + '/' + filename.replaceAll(normalizeClass(sourceDirName), normalizeClass(targetDirName)), newCode, {flag: 'w+'})
})
