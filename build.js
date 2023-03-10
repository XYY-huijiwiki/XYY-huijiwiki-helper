const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');
const cleanCSS = require('@node-minify/clean-css');
const htmlMinifier = require('@node-minify/html-minifier');
const jsonminify = require('@node-minify/jsonminify');
const path = require('path');
const fs = require('fs');

fs.mkdirSync(`dist`, { recursive: true });

minify({
    compressor: uglifyES,
    input: path.join('src', '羊羊百科小助手.js'),
    output: path.join('dist', '羊羊百科小助手.js'),
});

minify({
    compressor: cleanCSS,
    input: path.join('src', '羊羊百科小助手.css'),
    output: path.join('dist', '羊羊百科小助手.css'),
});

minify({
    compressor: htmlMinifier,
    input: path.join('src', '羊羊百科小助手.html'),
    output: path.join('dist', '羊羊百科小助手.txt'),
});

minify({
    compressor: jsonminify,
    input: path.join('src', '羊羊百科小助手.json'),
    output: path.join('dist', '羊羊百科小助手.json'),
});

let a = fs.readFileSync(path.join('src', '羊羊百科小助手.user.js'), {
    encoding: 'utf-8'
});
a = a.replace('（本地测试）', '');
a = a.replace('羊羊百科小助手.html', '羊羊百科小助手.txt');
a = a.replace(
    /file:\/\/D:\\文档\\GitHub\\XYY-huijiwiki-helper\\src\\/g,
    `https://cdn.jsdelivr.net/gh/XYY-huijiwiki/XYY-huijiwiki-helper@main/dist/`
);
fs.writeFileSync(path.join('dist', '羊羊百科小助手.user.js'), a);