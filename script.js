document.addEventListener('DOMContentLoaded', function() {
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
        fetch('https://raw.githubusercontent.com/songshua295/simeple-search/0a6e6650da1290ee299eaac5eb3577e1e607aaa1/config.yaml')
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
});
