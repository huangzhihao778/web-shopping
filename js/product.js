document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const addToCartBtn = document.querySelector('.add-to-cart');
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');
    const mainImage = document.querySelector('.product-main-image');
    const thumbnails = document.querySelectorAll('.product-thumbnails img');
    
    // 从API获取商品详情
    async function fetchProduct() {
        if (!productId) {
            window.location.href = 'shop.html';
            return;
        }
        
        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();
            
            if (!product) {
                window.location.href = 'shop.html';
                return;
            }
            
            renderProduct(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            window.location.href = 'shop.html';
        }
    }
    
    // 渲染商品详情
    function renderProduct(product) {
        document.querySelector('.product-name').textContent = product.name;
        document.querySelector('.product-price').textContent = `¥${product.price.toFixed(2)}`;
        document.querySelector('.product-description').textContent = product.description;
        document.querySelector('.product-details').textContent = product.details;
        
        // 设置主图
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
        
        // 设置缩略图
        const thumbnailsContainer = document.querySelector('.product-thumbnails');
        thumbnailsContainer.innerHTML = '';
        
        product.images.forEach((image, index) => {
            const thumb = document.createElement('img');
            thumb.src = image;
            thumb.alt = `${product.name} - 图${index + 1}`;
            thumb.addEventListener('click', () => {
                mainImage.src = image;
            });
            thumbnailsContainer.appendChild(thumb);
        });
    }
    
    // 添加到购物车
    function addToCart() {
        const quantity = parseInt(quantityInput.value);
        
        // 获取当前购物车
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // 检查商品是否已在购物车中
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const product = {
                id: productId,
                name: document.querySelector('.product-name').textContent,
                price: parseFloat(document.querySelector('.product-price').textContent.replace('¥', '')),
                image: mainImage.src,
                quantity: quantity
            };
            
            cart.push(product);
        }
        
        // 保存购物车
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // 更新购物车图标
        updateCartIcon();
        
        // 显示通知
        alert('商品已添加到购物车');
    }
    
    // 更新购物车图标
    function updateCartIcon() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartIcon = document.querySelector('.fa-shopping-bag');
        
        if (cartIcon) {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            
            if (count > 0) {
                cartIcon.setAttribute('data-count', count);
            } else {
                cartIcon.removeAttribute('data-count');
            }
        }
    }
    
    // 事件监听
    addToCartBtn.addEventListener('click', addToCart);
    
    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
    
    // 初始化
    fetchProduct();
    updateCartIcon();
});