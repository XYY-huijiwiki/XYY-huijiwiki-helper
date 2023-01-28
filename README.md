# XYY-huiji-wiki-helper
 mechanically process some data for XYY huiji wiki.

浏览器安装[油猴插件](https://www.tampermonkey.net)后，[点击这里](https://raw.githubusercontent.com/XYY-huiji-wiki/XYY-huiji-wiki-helper/main/%E7%BE%8A%E7%BE%8A%E7%99%BE%E7%A7%91%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js)安装“羊羊百科小助手”用户脚本。目前的功能有：

- 在优兔的视频列表页面（比如 https://www.youtube.com/playlist?list=PLCxAtDkpA3f-pJSUtq-gb27ndgVvrav2Z ）批量收集视频信息，可用于快速填写剧集信息。
- 在淘宝商品详情页面（比如 https://item.taobao.com/item.htm?id=666003448564 ）一键生成周边页面（比如[《筐出未来》2022台历礼盒](https://xyy.huijiwiki.com/wiki/%E3%80%8A%E7%AD%90%E5%87%BA%E6%9C%AA%E6%9D%A5%E3%80%8B2022%E5%8F%B0%E5%8E%86%E7%A4%BC%E7%9B%92)）的wiki代码。
- 在天猫商品详情页面（比如 https://detail.tmall.com/item.htm?id=695522923134 ）一键生成周边页面（比如[2023羊羊台历](https://xyy.huijiwiki.com/wiki/2023%E7%BE%8A%E7%BE%8A%E5%8F%B0%E5%8E%86)）的wiki代码。

## 使用方法
插件和脚本安装成功后，打开相应页面时右下角会出现一个按钮，点击按钮即可使用相关功能。

## 注意
- 优兔网页采用了SPA（单页面应用）技术，有时需要在对应页面刷新一次才能显示按钮。（准确来说，是从其他优兔页面进入播放列表页面后，需要刷新一次网页。）
- 暂时没有制作报错信息。如果使用过程出现什么奇怪的情况，可以在直接在Github反馈或在[羊羊百科](https://club.huijiwiki.com/wiki/%E7%89%B9%E6%AE%8A:%E9%A9%BE%E9%A9%B6%E5%AE%A4#/user/47472/chat)上给我留言。