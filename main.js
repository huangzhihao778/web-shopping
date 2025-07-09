// 加载精选商品
document.addEventListener('DOMContentLoaded', function() {
    // 模拟从API获取数据
    const featuredProducts = [
        {
            id: 1,
            name: "奢华玫瑰金按摩棒",
            price: 899,
            image: "images/product1.jpg",
            category: "vibrators"
        },
        {
            id: 2,
            name: "真丝蕾丝情趣内衣套装",
            price: 1299,
            image: "images/product2.jpg",
            category: "lingerie"
        },
        {
            id: 3,
            name: "情侣远程控制振动器",
            price: 1599,
            image: "images/product3.jpg",
            category: "couples"
        },
        {
            id: 4,
            name: "高级硅胶按摩器",
            price: 699,
            image: "images/product4.jpg",
            category: "vibrators"
        }
    ];

    const productGrid = document.querySelector('.product-grid');
    
    if (productGrid) {
        featuredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">¥${product.price.toFixed(2)}</div>
                <a href="product.html?id=${product.id}" class="btn">查看详情</a>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // 购物车功能
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 更新购物车图标数量
    function updateCartIcon() {
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
    
    updateCartIcon();
});

// 产品详情页逻辑
if (window.location.pathname.includes('product.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        // 这里应该从API获取具体产品信息
        // 模拟数据
        const product = {
            id: productId,
            name: "奢华玫瑰金按摩棒",
            price: 899,
            description: "这款高端按摩棒采用医用级硅胶材质，玫瑰金金属质感，多频振动模式，防水设计，为您带来极致愉悦体验。",
            details: "材质: 医用硅胶/不锈钢 | 尺寸: 18cm x 3cm | 充电时间: 2小时 | 使用时间: 3小时 | 防水等级: IPX7",
            images: [
                "images/product1.jpg",
                "images/product1-alt1.jpg",
                "images/product1-alt2.jpg"
            ]
        };
        
        // 填充产品信息
        document.querySelector('.product-name').textContent = product.name;
        document.querySelector('.product-price').textContent = `¥${product.price.toFixed(2)}`;
        document.querySelector('.product-description').textContent = product.description;
        document.querySelector('.product-details').textContent = product.details;
        
        // 主图
        const mainImage = document.querySelector('.product-main-image');
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
        
        // 缩略图
        const thumbnails = document.querySelector('.product-thumbnails');
        product.images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.alt = `${product.name} - 图${index + 1}`;
            thumb.addEventListener('click', () => {
                mainImage.src = img;
            });
            thumbnails.appendChild(thumb);
        });
        
        // 添加到购物车
        document.querySelector('.add-to-cart').addEventListener('click', function() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('商品已添加到购物车');
            updateCartIcon();
        });
    });
}

// 购物车页逻辑
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        function renderCart() {
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">您的购物车是空的</p>';
                checkoutBtn.style.display = 'none';
                cartTotal.textContent = '¥0.00';
                return;
            }
            
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">¥${itemTotal.toFixed(2)}</div>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
                `;
                cartItems.appendChild(cartItem);
            });
            
            cartTotal.textContent = `¥${total.toFixed(2)}`;
        }
        
        renderCart();
        
        // 数量增减
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('quantity-btn')) {
                const id = e.target.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                
                if (e.target.classList.contains('minus')) {
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        cart.splice(cart.indexOf(item), 1);
                    }
                } else if (e.target.classList.contains('plus')) {
                    item.quantity += 1;
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartIcon();
            }
            
            // 删除商品
            if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                const btn = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
                const id = btn.getAttribute('data-id');
                const itemIndex = cart.findIndex(item => item.id === id);
                
                if (itemIndex !== -1) {
                    cart.splice(itemIndex, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                    updateCartIcon();
                }
            }
        });
        
        // 结账
        checkoutBtn.addEventListener('click', function() {
            // 这里应该跳转到结账页面或处理结账逻辑
            alert('即将进入结账流程');
        });
    });
}