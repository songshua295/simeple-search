---
title: js-搜索小工具
date: 2024-07-09T15:35:15Z
lastmod: 2024-07-09T23:28:04Z
---

# 概述

项目地址：[https://github.com/songshua295/simeple-search.git](https://github.com/songshua295/simeple-search.git)

为了方便自己每次检索资料和视频内容，主要是网盘内容。

从百度等搜索引擎中搜索并不方便，所以做了这个小工具，用python进行爬虫的话，一方面对每个网站都需要进行适配，二是对于拦截以及验证样式过多，难以处理。

# 示例

demo效果：

1. 可以通过url传递参数
2. 看供选择多个搜索引擎
3. **可以用来同时使用多个网盘进行搜索**（主要作用：就是为了来搜索资料，因为每次点开一个网站搜索太慢了，是否使用全部搜索引擎搜索，通过yaml中的trunall进行设置。）

​![QQ202479-23177 -original-horizontal](assets/QQ202479-23177%20-original-horizontal-20240709231911-j9qfgb5.gif)​

‍

# 代码

index.html

```json
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>搜索工具</title>
    可以使用url传递参数
    ?engine=bing&s=key
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAoCAYAAABq13MpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAM9SURBVFhH7ZnbTxNBFMb71/qiMb5gotH4gJdEQQjIA4JYLLZcWihUWsWKgLeYGIOVQqBApZSCSCrt9gZt97hnM7vptNPu7NAUNvFLvnSbzpzzy2TOnGlrAwvqP3SrZCsWi+TROrLlcjnyaB3ZJEkij9ZR06FlWQYpk4V4IgnfV9Z078aPoFwskFFnU1Oho3vH4A4sQOeAEx72j9S4e2gU+l0+SBxlyAwxNQW6XCqBxx9kgtaz0xsEuXRKIpjTmaFxPq5gNVTHoAu6n0/AE8ck9LzwQKfyvnrMgGsK/kp5EolfZ4LO50+UxDMUCAKOfwyDfytf47Gln9Btn6DGI7jZFReHVgpuau4DBTDsW2DCVnv0DT0Pt4oZCUMnk3+oxA7fPBOQ6c1cDbiZ4hSGdnoDVFImnIH7HG59Pp4qvBKClstlCtj7KcSEMvLU57AeA4u5UOArSiHoVDpNQc+uJZlQPH48NKbHiWzFSYbGEoJe303piXqVI40Fw+ueYY8eCzsnj4Sgl0NRPdEz92smDK/xHG8JdDNXGhtQS6CLBUlPhPavHzOBeIydU4uDlyweCUHjXaMS2vttmwlkZOycWozOQSeUiickQ2MJQaP881/1hF3KCcCCMnKv0vK1GBP+9+q1lkfC0Hv7h3pCtH06yASr52HfIjU/mkiRyMYShsZVefX2C5WYFxxbfuU8vNaakWno41QaDn4fQi6XAffcEjx6+pICwK2i7vHq4oxIMLm8T41FYyfEGjEjU9BrkW24cvMuXGq7A9fbO6DPOQ3947M14JrxOMRzHF9Zn/fYx9T7uFlxQyPw1Vv3VWDNbfe6VHBc8eqtYuRJ5VqbzZr/AoDigo5EY/oKVxtXPJuV1D0eV4qz8lRhGW+Hm7921fu4qAyhY4kDJmylYzEFokK4R7EBYefElr+ynoDTk7xyDjfnh6GG0JHoDhOy0pdvtKvF2UrVhc5m0nDt9gMmqGbc46sbW2RG61QXOvBuiQmqGVf4PIBRdaFHPD4mrOaN7R0ysvWqCx1ajTBh0Vic56kGhSiD3TVOweKWOM8V1tQAGiXDj/AGONwzEAguqufxRZAB9MWUNX9Ut+TfF+TVQgL4B66BTb4YiI8xAAAAAElFTkSuQmCC">
    </style>
</head>
<body>
  
    <script >document.addEventListener('DOMContentLoaded', function() {
        // 创建固定容器
        const fixedContainer = document.createElement('div');
        fixedContainer.className = 'fixed-container';
  
        // 创建输入框
        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.id = 'keyword';
        keywordInput.placeholder = '输入关键字';
        // 设置输入框的初始值为 URL 参数中的 searchkey 参数值
        const urlParams = new URLSearchParams(window.location.search);
        const initialKeyword = urlParams.get('s');
        if (initialKeyword) {
            keywordInput.value = initialKeyword;
        }
        fixedContainer.appendChild(keywordInput);
  
        // 创建下拉菜单
        const searchEngineSelect = document.createElement('select');
        searchEngineSelect.id = 'searchEngine';
        fixedContainer.appendChild(searchEngineSelect);
  
        // 创建按钮
        const searchButton = document.createElement('button');
        searchButton.id = 'searchButton';
        searchButton.textContent = '搜索';
        fixedContainer.appendChild(searchButton);
  
        // 将固定容器插入到页面中
        document.body.appendChild(fixedContainer);
  
        // 添加固定容器的样式
        const style = document.createElement('style');
        style.textContent = `
            .fixed-container {
                position: fixed;
                top: 200px;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--white);
                padding: 15px;
                border: 1px solid var(--gray);
                box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
                border-radius: 5px;
                text-align: center;
                max-width: 1000px;
            }
            #keyword, #searchEngine, #searchButton {
                font: 14px var(--font-family-sans-serif);
                margin: 5px 0;
                padding: 10px;
                border: 1px solid var(--gray);
                border-radius: 4px;
                box-sizing: border-box;
                width: 100%;
                max-width: 300px;
            }
            #keyword {
                margin-right: 10px;
            }
            #searchEngine {
                background-color: var(--white);
                color: rgba(0,0,0,.85);
                padding: 10px;
                border: 1px solid var(--gray);
                border-radius: 4px;
                box-sizing: border-box;
                width: 100%;
                max-width: 300px;
                -webkit-text-size-adjust: 100%;
                font-size: .875rem;
            }
            #searchButton {
                background-color: var(--primary);
                color: var(--white);
                border: none;
                cursor: pointer;
                box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
            }
            #searchButton:hover {
                background-color: var(--dark);
            }
        `;
        document.head.appendChild(style);
  
        // 加载 js-yaml 库
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js';
        document.head.appendChild(script);
  
        // 等待 js-yaml 库加载完成后执行
        script.onload = function() {
            // 加载 YAML 配置文件的路径
            fetch('config.yaml')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    try {
                        const config = jsyaml.load(data);
                        populateSelect(config, urlParams.get('engine'));
                    } catch (e) {
                        console.error('Error parsing YAML file:', e);
                    }
                })
                .catch(error => console.error('Error loading YAML file:', error));
        };
  
        // 填充 select 元素
        function populateSelect(config, initialEngine) {
            config.forEach(item => {
                const key = Object.keys(item)[0];
                const optgroup = document.createElement('optgroup');
                optgroup.label = key;
                const engine = item[key].engine;
                const trunall = item[key].trunall;
  
                optgroup.dataset.trunall = trunall; // 将 trunall 属性添加到 optgroup 上
  
                engine.forEach(engineObj => {
                    const engineName = Object.keys(engineObj)[0];
                    const engineUrl = engineObj[engineName];
  
                    const option = document.createElement('option');
                    option.text = engineName;
                    option.value = engineUrl;
                    optgroup.appendChild(option);
                });
  
                searchEngineSelect.appendChild(optgroup);
            });
  
            // 设置下拉菜单的初始值为 URL 参数中的 engine 参数值
            if (initialEngine) {
                // 遍历搜索引擎选项，找到匹配的项并设置为初始选中状态
                Array.from(searchEngineSelect.options).forEach(option => {
                    if (option.text === initialEngine) {
                        option.selected = true;
                    }
                });
            }
        }
  
        // 点击搜索按钮时的处理函数
        searchButton.addEventListener('click', function() {
            search();
        });
  
        // 按回车键时的处理函数
        keywordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                search();
            }
        });
  
        // 执行搜索操作
        function search() {
            const keyword = keywordInput.value.trim();
            const engine = searchEngineSelect.value;
  
            if (engine && keyword) {
                const optgroup = Array.from(searchEngineSelect.children).find(opt => opt.label === searchEngineSelect.selectedOptions[0].parentNode.label);
                const trunall = optgroup.dataset.trunall === 'on';
                if (trunall) {
                    const allOptions = optgroup.querySelectorAll('option');
                    allOptions.forEach(option => {
                        const searchUrl = option.value + encodeURIComponent(keyword);
                        window.open(searchUrl, '_blank');
                    });
                } else {
                    const searchUrl = engine + encodeURIComponent(keyword);
                    window.open(searchUrl, '_blank');
                }
            } else {
                alert('缺少必要的参数');
            };
        }
  
        // 页面加载完后自动将焦点聚焦在输入框上
        keywordInput.focus();
    });
    </script>
</body>
</html>

```

config.yaml

```yaml
- 搜索引擎:
    trunall: off
    engine:
      - bing: "https://www.bing.com/search?q="
      - 谷歌: "https://www.google.com/search?q="
      - 百度: "https://www.baidu.com/s?wd="
      - 夸克: "https://s.quark.cn/s?q="
      - 鸭子: "https://duckduckgo.com/?ia=web&q="
- 网盘全搜索on:
    trunall: on
    engine:
      - yiso: "https://yiso.fun/info?searchKey="
      - 混合盘: "https://hunhepan.com/search?q="
      - 天天: "https://www.daysou.com/s?q="
      - 秒搜: "https://miaosou.fun/info?searchKey="
      - 毕方: "https://www.bifangpu.com/resource/search/"
      - 云盘盘: "https://www.yppan.com/?s="
- 单个网盘:
    trunall: off
    engine:
      - yiso: "https://yiso.fun/info?searchKey="
      - 混合盘: "https://hunhepan.com/search?q="
- 求职:
    trunall: off
    engine:
      - 猎聘: "https://www.liepin.com/zhaopin/?key="
      - 前程无忧: "https://search.51job.com/?"
      - 拉钩: "https://www.lagou.com/jobs/list_"
      - 猎聘: "https://www.liepin.com/zhaopin/?key="
```

# 书签的方式

效果展示：

​![QQ202479-232448 -original-horizontal](assets/QQ202479-232448%20-original-horizontal-20240709232541-jfufbjn.gif)​
