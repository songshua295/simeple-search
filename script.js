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
    const initialKeyword = urlParams.get('searchkey');
    if (initialKeyword) {
        keywordInput.value = initialKeyword;
    }
    fixedContainer.appendChild(keywordInput);

    // 创建下拉菜单
    const searchEngineSelect = document.createElement('select');
    searchEngineSelect.id = 'searchEngine';
    // 设置下拉菜单的初始值为 URL 参数中的 engine 参数值
    const initialEngine = urlParams.get('engine');
    if (initialEngine) {
        searchEngineSelect.value = initialEngine;
    }
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
            top: 10px;
            right: 10px;
            background-color: white;
            padding: 10px;
            border: 1px solid #ccc;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);

    // 加载 js-yaml 库
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js';
    document.head.appendChild(script);

    // 等待 js-yaml 库加载完成后执行
    script.onload = function() {
        // 加载 YAML 配置文件
        fetch('http://127.0.0.1:456/config.yaml')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                try {
                    const config = jsyaml.load(data);
                    populateSelect(config);
                } catch (e) {
                    console.error('Error parsing YAML file:', e);
                }
            })
            .catch(error => console.error('Error loading YAML file:', error));
    };

    // 填充 select 元素
    function populateSelect(config) {
        config.forEach(item => {
            const key = Object.keys(item)[0];
            const optgroup = document.createElement('optgroup');
            optgroup.label = key;
            const engine = item[key].engine;
            const trunall = item[key].trunall;

            optgroup.dataset.trunall = trunall; // 将 trunall 属性添加到 optgroup 上

            engine.forEach(engine => {
                const option = document.createElement('option');
                option.text = Object.keys(engine)[0];
                option.value = engine[Object.keys(engine)[0]];
                optgroup.appendChild(option);
            });

            searchEngineSelect.appendChild(optgroup);
        });

        // 设置下拉菜单的初始值为 URL 参数中的 engine 参数值
        if (initialEngine) {
            searchEngineSelect.value = initialEngine;
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
        const engine = urlParams.get('engine');
        const type = urlParams.get('type');

        // 根据 type 查找对应的 optgroup
        const optgroup = Array.from(searchEngineSelect.children).find(opt => opt.label === type);

        if (engine && optgroup && keyword) {
            const selectedOption = Array.from(optgroup.children).find(opt => opt.value === engine);
            if (selectedOption) {
                const trunall = optgroup.dataset.trunall === 'on';
                if (trunall) {
                    const allOptions = optgroup.querySelectorAll('option');
                    allOptions.forEach(option => {
                        const searchUrl = option.value + encodeURIComponent(keyword);
                        window.open(searchUrl, '_blank');
                    });
                } else {
                    const searchUrl = selectedOption.value + encodeURIComponent(keyword);
                    window.open(searchUrl, '_blank');
                }
            } else {
                alert('未找到匹配的搜索引擎');
            }
        } else {
            alert('缺少必要的参数');
        }
    }
});
