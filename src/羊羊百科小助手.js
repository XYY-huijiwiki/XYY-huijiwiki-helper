//加载CSS
GM_addStyle(GM_getResourceText("css"));

//防止jQuery冲突
$.noConflict();
jQuery(document).ready(function ($) {
  $("body").append(GM_getResourceText(`html`));
  //初始化
  (async () => {
    console.log("[羊羊百科小助手]正在加载Vue……");
    await $.getScript("https://cdn.jsdelivr.net/npm/vue/dist/vue.global.js");
    console.log("[羊羊百科小助手]正在加载Naive UI……");
    await $.getScript(
      "https://cdn.jsdelivr.net/npm/naive-ui/dist/index.prod.js"
    );
    // console.log('[羊羊百科小助手]正在加载spark-md5……');
    // await $.getScript('https://cdn.jsdelivr.net/npm/spark-md5/spark-md5.min.js');
    console.log("[羊羊百科小助手]正在加载axios……");
    await $.getScript("https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js");
    console.log("[羊羊百科小助手]正在加载js-sleep……");
    await $.getScript(
      "https://cdn.jsdelivr.net/gh/colxi/js-sleep@master/js-sleep.js"
    );
    console.log("[羊羊百科小助手]正在启动程序……");
    await initVue();
    console.log("[羊羊百科小助手]启动完成。");
  })();

  //启动Vue
  function initVue() {
    // 配置Vue程序
    const App = {
      setup() {
        //判断当前网站
        let currentSite = "";
        if (location.href.match(/www.youtube.com\/playlist*/)) {
          currentSite = "优兔";
        }
        if (location.href.match(/item.taobao.com\/item.htm*/)) {
          currentSite = "淘宝";
        }
        if (location.href.match(/detail.tmall.com\/item.htm*/)) {
          currentSite = "天猫";
        }
        if (location.href.match(/www.mgtv.com\/h\/*/)) {
          currentSite = "芒果TV";
        }

        // 导入功能组件和定义变量
        let darkTheme = naive.darkTheme;
        let zhCN = naive.zhCN;
        osThemeRef = naive.useOsTheme();
        let resCode = Vue.ref("");
        let productItem = Vue.ref({
          pagename: "",
          price: "",
          date: null,
          feat: "",
          ifImgDownload: false,
        });
        let loading = Vue.ref(false);

        // 功能1：获取优兔播放列表
        function getYouTubeList(type) {
          console.log("正在获取优兔播放列表……");

          // 等待div#primary准备就绪
          if ($("div#primary").text() === "") {
            resCode.value = `网页未加载完成。请等待网页加载完毕后再试。`;
          } else {
            let res = {
              link: [],
              title: [],
              wiki: [],
            };
            $("a#video-title").each((index, ele) => {
              let link =
                "https://youtu.be/" +
                $(ele)
                  .attr("href")
                  .match(/v=(.*?)&/)[1];
              let title = $(ele).attr("title") + ` - YouTube`;
              let wiki = `[${link} ${title}]`;
              res["link"] = res["link"].concat(link);
              res["title"] = res["title"].concat(title);
              res["wiki"] = res["wiki"].concat(wiki);
            });

            resCode.value = res[type].join("\n");
          }
        }

        // 功能2：获取淘宝商品信息
        async function getTaobaoItem() {
          productItem.value.pagename = productItem.value.pagename || "页面名称";
          productItem.value.price =
            productItem.value.price || $("#J_StrPrice>.tb-rmb-num").text();
          let link = `https://item.taobao.com/item.htm?id=${g_config.itemId}`;
          let img = g_config.idata.item.auctionImages;

          //加载品牌信息
          let brand =
            JSON.parse(GM_getResourceText("json"))["Taobao2Brand"][
              g_config.shopName
            ] || "";

          //加载主题信息
          let series = JSON.parse(GM_getResourceText("json"))["series"];
          let defaultFeat = "";
          series.forEach((element) => {
            if (g_config["idata"]["item"]["title"].includes(element)) {
              defaultFeat = element;
            }
          });
          productItem.value.feat = productItem.value.feat || defaultFeat;

          //收集颜色分类的图片
          $("#J_isku .J_TSaleProp a").each((index, ele) => {
            if ($(ele).attr("style")) {
              img = img.concat(
                $(ele)
                  .attr("style")
                  .replace("background:url(", "")
                  .replace("_30x30.jpg) center no-repeat;", "")
              );
            }
          });
          //加上https前缀并去除重复图片
          img.forEach((ele, index) => {
            img[index] = ele.replace(/\/\/gd\d./, "https://gd1.");
          });
          img = Array.from(new Set(img));
          //排序和下载图片
          let imgNameList = [];
          img.forEach((ele, index) => {
            if (productItem.value.ifImgDownload) {
              GM_download(
                ele,
                productItem.value.pagename + (index + 1) + ele.slice(-4)
              );
            }
            imgNameList = imgNameList.concat(
              productItem.value.pagename + (index + 1) + ele.slice(-4)
            );
          });
          let imgNameStr = imgNameList.join("\n");

          //加载长图
          let longImg = []; //长图的链接列表
          let longImgList = []; //长图的文件名列表
          let longImgStr = ""; //长图的文件名字符串

          $("#J_DivItemDesc img").each((index, ele) => {
            let a = $(ele).attr("src");
            a.slice(0, 4) === "http" ? (a = a) : (a = "https:" + a);
            longImg = longImg.concat(a);
          });
          console.log(longImg);

          //排序和下载长图
          longImg.forEach((ele, index) => {
            if (productItem.value.ifImgDownload) {
              GM_download(
                ele,
                productItem.value.pagename +
                  " 描述图" +
                  (index + 1) +
                  ele.slice(-4)
              );
            }
            longImgList = longImgList.concat(
              productItem.value.pagename +
                " 描述图" +
                (index + 1) +
                ele.slice(-4)
            );
          });
          longImgStr = longImgList.join("|");

          //等待长图加载完毕后输出结果
          resCode.value = `{{周边信息\n|版权=\n|尺寸=\n|定价=${
            productItem.value.price
          }\n|货号=\n|链接（京东）=\n|链接（乐乎市集）=\n|链接（奇货）=\n|链接（淘宝）=${link}\n|链接（天猫）=\n|链接（玩具反斗城）=\n|品牌=${brand}\n|日期=${
            productItem.value.date || ""
          }\n|适龄=\n|条码=\n|主题=${
            productItem.value.feat
          }\n}}\n\n<gallery>\n${imgNameStr}\n</gallery>\n\n{{长图|${longImgStr}}}\n`;
        }

        // 功能3：获取天猫商品信息
        async function getTianmaoItem() {
          // 开启加载动画
          loading.value = true;

          productItem.value.pagename = productItem.value.pagename || "页面名称";
          productItem.value.price =
            productItem.value.price ||
            $(
              "[class^=Price--originPrice] [class^=Price--priceText--2nLbVda]"
            ).text();

          //加载主题信息
          let series = JSON.parse(GM_getResourceText("json"))["series"];
          let defaultFeat = "";
          series.forEach((element) => {
            if ($("[class^=ItemHeader--mainTitle]").text().includes(element)) {
              defaultFeat = element;
            }
          });
          productItem.value.feat = productItem.value.feat || defaultFeat;

          //加载品牌信息
          let brand =
            JSON.parse(GM_getResourceText("json"))["Tianmao2Brand"][
              $("[class^=ShopFloat--title]").text()
            ] || "";

          //加载链接信息
          let link =
            "https://detail.tmall.com/item.htm?id=" +
            $("#aliww-click-trigger").attr("data-item");

          //加载描述图
          let longImgList = [];
          $(`[class^='descV8'] img`).each((index, ele) => {
            longImgList = longImgList.concat($(ele).attr("src"));
            console.log(longImgList);
          });
          //生成文件名
          let longImgNameList = [];
          longImgList.forEach((element, index) => {
            longImgNameList[index] =
              productItem.value.pagename +
              " 描述图" +
              (index + 1) +
              element.slice(-4);
            if (productItem.value.ifImgDownload) {
              GM_download(element, longImgNameList[index]);
            }
          });
          let longImgNameStr = longImgNameList.join("|");

          async function getBase64Image(src) {
            let response = await fetch(src);
            let blob = await response.blob();
            return new Promise((resolve) => {
              let reader = new FileReader();
              reader.onloadend = function () {
                resolve(reader.result);
              };
              reader.readAsDataURL(blob);
            });
          }

          async function removeDuplicateImages(imgList) {
            let base64List = await Promise.all(imgList.map(getBase64Image));
            let uniqueBase64List = [...new Set(base64List)];
            let uniqueImgList = [];
            for (let i = 0; i < uniqueBase64List.length; i++) {
              uniqueImgList[i] =
                imgList[base64List.indexOf(uniqueBase64List[i])];
            }
            return uniqueImgList;
          }

          // Load main image
          let imgList = $("[class^=PicGallery--thumbnailPic], .skuIcon")
            .map((index, ele) => $(ele).attr("src"))
            .get();
          // Add https prefix and remove image compression suffix
          imgList = imgList.map(
            (element) =>
              "https:" +
              element.replace(/_(110x10000Q75|60x60q50)\.jpg_\.webp/, "")
          );
          // Remove duplicate images
          imgList = await removeDuplicateImages(imgList);
          // Generate filenames
          let imgNameList = imgList.map(
            (element, index) =>
              productItem.value.pagename + (index + 1) + element.slice(-4)
          );
          if (productItem.value.ifImgDownload) {
            imgNameList.forEach((name, index) =>
              GM_download(imgList[index], name)
            );
          }
          let imgNameStr = imgNameList.join("\n");

          //等待长图加载完毕后输出结果
          resCode.value = `{{周边信息\n|版权=\n|尺寸=\n|定价=${
            productItem.value.price
          }\n|货号=\n|链接（京东）=\n|链接（乐乎市集）=\n|链接（奇货）=\n|链接（淘宝）=\n|链接（天猫）=${link}\n|链接（玩具反斗城）=\n|品牌=${brand}\n|日期=${
            productItem.value.date || ""
          }\n|适龄=\n|条码=\n|主题=${
            productItem.value.feat
          }\n}}\n\n<gallery>\n${imgNameStr}\n</gallery>\n\n{{长图|${longImgNameStr}}}\n`;

          // 关闭加载动画
          loading.value = false;
        }

        // 功能4：获取芒果TV剧集数据
        async function getMangguoList(type) {
          loading.value = true;

          // 定义一些参数
          let id = __NUXT__["data"][0]["collection_id"];
          let page = 1;
          let list_array = [];

          // 如果已经请求过一次，就把内容存在window.xyy里，不用重复请求。
          if (typeof xyy === "undefined") {
            do {
              var a = await axios.get(
                `https://pcweb2.api.mgtv.com/episode/list?collection_id=${id}&page=${page}`
              );
              page++;
              console.log(`page=${a[`data`][`data`][`current_page`]}`);
              list_array = list_array.concat(a[`data`][`data`][`list`]);
              await sleep(1000);
            } while (
              a[`data`][`data`][`total_page`] !=
              a[`data`][`data`][`current_page`]
            );
            window.xyy = list_array;
          } else {
            list_array = xyy;
          }

          // 处理结果
          let res = {
            link: "",
            title: "",
          };
          list_array.forEach((element) => {
            res["link"] =
              res["link"] + "https://www.mgtv.com" + element["url"] + "\n";
            res["title"] = res["title"] + element["t2"] + "\n";
          });
          resCode.value = res[type];

          loading.value = false;
        }

        // 手动暴露Vue参数
        return {
          showDrawer: Vue.ref(false),
          resCode,
          currentSite,
          productItem,
          getYouTubeList,
          getTaobaoItem,
          getTianmaoItem,
          getMangguoList,
          darkTheme,
          zhCN,
          loading,
          theme: Vue.computed(() =>
            osThemeRef.value === "dark" ? darkTheme : null
          ),
          osTheme: osThemeRef,
        };
      },
    };

    // 启动Vue
    const app = Vue.createApp(App);
    app.use(naive);
    app.mount("#XYY-huijiwiki-helper");
  }
});
