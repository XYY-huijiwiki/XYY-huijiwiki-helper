const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');
const cleanCSS = require('@node-minify/clean-css');
const htmlMinifier = require('@node-minify/html-minifier');
const jsonminify = require('@node-minify/jsonminify');
const path = require('path');
const fs = require('fs');

minify({
    compressor: uglifyES,
    input: path.join('src', '羊羊百科小助手.js'),
    output: path.join('dist', '羊羊百科小助手.min.js'),
});

minify({
    compressor: cleanCSS,
    input: path.join('src', '羊羊百科小助手.css'),
    output: path.join('dist', '羊羊百科小助手.min.css'),
});

minify({
    compressor: htmlMinifier,
    input: path.join('src', '羊羊百科小助手.html'),
    output: path.join('dist', '羊羊百科小助手.txt'),
});

minify({
    compressor: jsonminify,
    input: path.join('src', '羊羊百科小助手.json'),
    output: path.join('dist', '羊羊百科小助手.min.json'),
});

let a = fs.readFileSync(path.join('src', '羊羊百科小助手.user.js'), {
    encoding: 'utf-8'
});
a = a.replace('（本地测试）', '');
a = a.replace(
    /file:\/\/D:\\文档\\GitHub\\XYY-huiji-wiki-helper\\src/g,
    `https://cdn.jsdelivr.net/gh/XYY-huiji-wiki/XYY-huiji-wiki-helper@main/dist`
);
fs.writeFileSync(path.join('dist', '羊羊百科小助手.user.js'), a);