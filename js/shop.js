document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.querySelector('.product-grid');
    const sortSelect = document.querySelector('.sort-select');
    const filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const priceRange = document.querySelector('.price-range');
    const priceValues = document.querySelector('.price-values');
    
    // 从API获取商品数据
    async function fetchProducts() {
        try {
            // 获取筛选参数
            const categories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
                .map(cb => cb.value);
            const features = Array.from(document.querySelectorAll('input[name="feature"]:checked'))
                .map(cb => cb.value);
            const maxPrice = priceRange.value;
            const sort = sortSelect.value;
            
            // 构建查询参数
            const params = new URLSearchParams();
            
            if (categories.length) {
                params.append('category', categories.join(','));
            }
            
            if (features.includes('new')) {
                params.append('new', 'true');
            }
            
            if (features.includes('bestseller')) {
                params.append('bestseller', 'true');
            }
            
            if (features.includes('sale')) {
                params.append('sale', 'true');
            }
            
            params.append('maxPrice', maxPrice);
            params.append('sort', sort);
            
            const response = await fetch(`/api/products?${params.toString()}`);
            const products = await response.json();
            
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    
    // 渲染商品列表
    function renderProducts(products) {
        productGrid.innerHTML = '';
        
        if (products.length === 0) {
            productGrid.innerHTML = '<p class="no-products">没有找到符合条件的商品</p>';
            return;
        }
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">¥${product.price.toFixed(2)}</div>
                <a href="product.html?id=${product._id}" class="btn">查看详情</a>
            `;
            productGrid.appendChild(productCard);
        });
    }
    
    // 价格范围显示
    function updatePriceValues() {
        priceValues.children[1].textContent = `¥${priceRange.value}`;
    }
    
    // 事件监听
    sortSelect.addEventListener('change', fetchProducts);
    applyFiltersBtn.addEventListener('click', fetchProducts);
    priceRange.addEventListener('input', updatePriceValues);
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // 如果是分类复选框，确保同一时间只有一个被选中
            if (this.name === 'category') {
                if (this.checked) {
                    document.querySelectorAll(`input[name="category"]:not(#${this.id})`).forEach(cb => {
                        cb.checked = false;
                    });
                }
            }
        });
    });
    
    // 初始化
    updatePriceValues();
    fetchProducts();
});