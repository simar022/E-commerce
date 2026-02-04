const products = [
    { id: 1, name: "BassPro Earbuds", price: 1499, imgID: "1590658268037-6bf12165a8df", desc: "Heavy bass, light on the pocket." },
    { id: 2, name: "FitBand Lite", price: 999, imgID: "1575311373937-040b8e1fd5b6", desc: "Track steps, not just time." },
    { id: 3, name: "10k mAh PowerBrick", price: 799, imgID: "1609091839311-d536819bc248", desc: "Reliable juice for long days." },
    { id: 4, name: "Silent Click Mouse", price: 499, imgID: "1527864550417-7fd91fc51a46", desc: "Work in peace, zero noise." },
    { id: 5, name: "RGB Desk Strip", price: 399, imgID: "1550009158-9ebf69173e03", desc: "Instant mood lighting for your setup." },
    { id: 6, name: "Laptop Stand Pro", price: 1199, imgID: "1527443224154-c4a3942d3acf", desc: "Save your neck, work better." },
    { id: 7, name: "Mini BT Speaker", price: 899, imgID: "1608156639585-34054e815958", desc: "Pocket-sized party starter." },
    { id: 8, name: "Type-C Braided Cable", price: 299, imgID: "1588505794041-9c35a630985a", desc: "Unbreakable charging solution." },
    { id: 9, name: "Webcam Privacy Cover", price: 149, imgID: "1585338107529-13afc5f02586", desc: "Secure your space instantly." },
    { id: 10, name: "Gaming Pad XL", price: 599, imgID: "1616628188502-413f2fe46e5e", desc: "Smooth glide for high stakes." },
    { id: 11, name: "Smart Bulb (WiFi)", price: 699, imgID: "1550985616-10810253b84d", desc: "Control your room from your phone." },
    { id: 12, name: "Phone Tripod Mount", price: 450, imgID: "1586105251261-72a756654ff1", desc: "Perfect for steady reels." },
    { id: 13, name: "Wireless Keyboard", price: 1899, imgID: "1587829741301-dc798b83dadc", desc: "Clean desk, no wires." },
    { id: 14, name: "USB Hub 4-Port", price: 650, imgID: "1618410313554-15962776856c", desc: "Connect everything at once." },
    { id: 15, name: "Earphone Hard Case", price: 199, imgID: "1544650030-3c51ad35730d", desc: "Protect your audio gear." }
];

let cart = JSON.parse(localStorage.getItem('myCart')) || {};

function saveCart() {
    localStorage.setItem('myCart', JSON.stringify(cart));
}

function addToCart(id) {
    if (cart[id]) {
        cart[id].qty += 1;
    } else {
        const product = products.find(p => p.id === id);
        if (product) {
            cart[id] = { ...product, qty: 1 };
        }
    }
    
    saveCart();     
    updateCartUI();  
    
    const drawer = document.getElementById('cart-drawer');
    if (drawer && !drawer.classList.contains('active')) {
        toggleCart();
    }
}

function changeQty(id, delta) {
    if (!cart[id]) return;

    cart[id].qty += delta;

    if (cart[id].qty <= 0) {
        delete cart[id];
    }

    saveCart();      
    updateCartUI(); 
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    let totalItems = 0;
    let totalPrice = 0;
    
    if (list) list.innerHTML = "";

    Object.values(cart).forEach(item => {
        totalItems += item.qty;
        totalPrice += (item.price * item.qty);
        
        if (list) {
            list.innerHTML += `
                <div class="cart-item">
                    <div style="flex:1">
                        <div style="font-weight:700">${item.name}</div>
                        <div style="font-size:0.85rem; color:var(--accent)">₹${item.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            `;
        }
    });

    if (countEl) countEl.innerText = totalItems;
    if (totalEl) totalEl.innerText = `₹${totalPrice.toLocaleString('en-IN')}`;

    if (checkoutBtn) {
        if (totalItems > 0) {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = "1";
            checkoutBtn.style.cursor = "pointer";
            checkoutBtn.onclick = () => {
                window.location.href = 'checkout.html';
            };
        } else {
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = "0.5";
            checkoutBtn.style.cursor = "not-allowed";
            checkoutBtn.onclick = null;
        }
    }
}

function applyTheme() {
    const savedVibe = localStorage.getItem('vibe') || 'light-mode';
    document.body.className = savedVibe;
}

const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode', !isDark);
        localStorage.setItem('vibe', isDark ? 'dark-mode' : 'light-mode');
    });
}

window.onload = () => {
    applyTheme();
    updateCartUI(); 
    
    const path = window.location.pathname;
    
    if (path.includes('product.html')) {
        initProductDetail();
    } else if (path.includes('deals.html')) {
        initDealsPage();
    } else if (path.includes('checkout.html')) {
        initCheckoutPage();
    } else {
        initCatalog();
    }
}


function initCatalog() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    grid.innerHTML = products.map(p => {
        const imgUrl = `https://images.unsplash.com/photo-${p.imgID}?auto=format&fit=crop&w=500&q=80`;
        
        return `
            <div class="card">
                <div class="img-container" style="overflow:hidden; border-radius:12px; height:200px;">
                    <img src="${imgUrl}" 
                         alt="${p.name}" 
                         onclick="location.href='product.html?id=${p.id}'" 
                         style="cursor:pointer; width:100%; height:100%; object-fit:cover;"
                         onerror="this.src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500'">
                </div>
                <h3 onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer; margin-top:15px;">${p.name}</h3>
                <div class="price">₹${p.price.toLocaleString('en-IN')}</div>
                <button class="add-btn" onclick="addToCart(${p.id})">Add to Bag</button>
            </div>
        `;
    }).join('');
}

function initProductDetail() {
    const container = document.getElementById('detail-view');
    if (!container) return; 

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    const p = products.find(item => item.id === parseInt(id));

    if (p) {
        container.innerHTML = `
            <div class="product-img">
                <img src="https://images.unsplash.com/photo-${p.imgID}?w=800" alt="${p.name}">
            </div>
            <div class="product-details">
                <a href="index.html" class="back-link">← Back to Shop</a>
                <h1>${p.name}</h1>
                <p class="product-desc">${p.desc}</p>
                
                <div class="spec-list">
                    <h4>Technical Aukaat</h4>
                    <ul>
                        ${p.specs ? p.specs.map(s => `<li>✅ ${s}</li>`).join('') : '<li>✅ High Quality Tech</li>'}
                    </ul>
                </div>
                
                <div class="price-action">
                    <div class="detail-price">₹${p.price.toLocaleString('en-IN')}</div>
                    <button class="add-btn" onclick="addToCart(${p.id})">Add to Bag</button>
                </div>
                 <div class="reviews-section">
                    <h3 class="syne-font" style="margin-bottom:20px;">Customer Bakwaas (Reviews)</h3>
                    
                    <div class="review-card">
                        <div class="review-header">
                            <span class="reviewer-name">Ankit S.</span>
                            <span class="stars">★★★★★</span>
                        </div>
                        <p style="font-size:0.9rem;">"Bhai, original item hai. I was worried it might be plastic-ky but it feels premium. Bass is lethal."</p>
                    </div>

                    <div class="review-card">
                        <div class="review-header">
                            <span class="reviewer-name">Priya V.</span>
                            <span class="stars">★★★★☆</span>
                        </div>
                        <p style="font-size:0.9rem;">"Delivery took 3 days, but product quality is 10/10. Looks killer in my setup."</p>
                    </div>

                    <div class="review-card">
                        <div class="review-header">
                            <span class="reviewer-name">Suresh 'The Techie'</span>
                            <span class="stars">★★★★★</span>
                        </div>
                        <p style="font-size:0.9rem;">"Best tech at this budget in India. No cap. Just buy it."</p>
                    </div>
             </div>`;
    } else {
        container.innerHTML = `
            <div style="text-align:center; padding: 50px; width: 100%;">
                <h2>Product Gayab! (Not Found)</h2>
                <a href="index.html" class="vibe-btn" style="display:inline-block; margin-top:20px;">Go Back to Shop</a>
            </div>`;
    }
}

function initDealsPage() {
        function startTimer() {
            let time = 3600 * 5; 
            setInterval(() => {
                let h = Math.floor(time / 3600);
                let m = Math.floor((time % 3600) / 60);
                let s = time % 60;
                document.getElementById('timer').innerText = 
                    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                time--;
            }, 1000);
        }
startTimer();
}

function initCheckoutPage() {
    const list = document.getElementById('checkout-items-list');
    const upsellGrid = document.getElementById('upsell-grid');
    if (!list) return;

    let subtotal = 0;
    list.innerHTML = "";

    Object.values(cart).forEach(item => {
        subtotal += (item.price * item.qty);
        list.innerHTML += `
            <div class="checkout-item">
                <img src="https://images.unsplash.com/photo-${item.imgID}?w=150">
                <div style="flex:1">
                    <h4 class="syne-font">${item.name}</h4>
                    <p>Qty: ${item.qty} × ₹${item.price}</p>
                </div>
                <div style="font-weight:700">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
            </div>
        `;
    });

    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    document.getElementById('subtotal').innerText = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('tax').innerText = `₹${tax.toLocaleString('en-IN')}`;
    document.getElementById('grand-total').innerText = `₹${total.toLocaleString('en-IN')}`;

    const shuffled = products.sort(() => 0.5 - Math.random());
    const recommendations = shuffled.slice(0, 2);
    
    upsellGrid.innerHTML = recommendations.map(p => `
        <div class="upsell-card">
            <img src="https://images.unsplash.com/photo-${p.imgID}?w=100">
            <div style="flex:1">
                <div style="font-size:0.8rem; font-weight:700;">${p.name}</div>
                <div style="font-size:0.75rem; color:var(--accent);">₹${p.price}</div>
            </div>
            <button onclick="addToCart(${p.id}); location.reload();" class="vibe-btn" style="padding:5px 10px; font-size:0.7rem;">+ Add</button>
        </div>
    `).join('');
}

function processOrder() {
    if (Object.keys(cart).length === 0) {
        alert("Bhai, cart empty hai! Add something first.");
        return;
    }
    
    document.body.innerHTML = `
        <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; background:var(--bg); color:var(--text);">
            <h1 class="syne-font" style="font-size:5rem; color:var(--accent);">SUCCESS!</h1>
            <p style="font-size:1.5rem;">Your gear is being packed by the Bhai-Log.</p>
            <p style="opacity:0.6;">Order ID: #DIGI${Math.floor(Math.random()*90000) + 10000}</p>
            <button onclick="location.href='index.html'" class="pay-btn" style="width:200px; margin-top:30px;">Go Back Home</button>
        </div>
    `;
    localStorage.removeItem('myCart'); 
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('active');
}

function handleImgError(image) {
    image.onerror = "";
    image.src = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500";
    return true;
}

function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

function openPaymentGateway() {
    if (Object.keys(cart).length === 0) return alert("Bhai, cart khali hai!");
    const total = document.getElementById('grand-total').innerText;
    document.getElementById('razor-amount').innerText = total;
    document.getElementById('razor-order-id').innerText = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('payment-modal').style.display = "flex";
}

function switchTab(evt, tabId) {
    const panels = document.querySelectorAll('.tab-panel');
    const tabs = document.querySelectorAll('.pay-tab');
    panels.forEach(p => p.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    
    document.getElementById(tabId + '-panel').classList.add('active');
    evt.currentTarget.classList.add('active');
}

function simulateSuccess() {
    const payBtn = document.querySelector('.pay-now-btn');
    payBtn.innerText = "Processing Payment...";
    payBtn.disabled = true;

    const orderId = "#DA-" + document.getElementById('razor-order-id').innerText;
    const finalTotal = document.getElementById('grand-total').innerText;
    const itemsList = Object.values(cart).map(i => `${i.name} (x${i.qty}) - ₹${i.price * i.qty}`).join('\n');
    setTimeout(() => {
        document.getElementById('payment-modal').style.display = "none";
        document.getElementById('main-checkout-view').style.display = "none";
        document.getElementById('tracker-view').style.display = "block";
        document.getElementById('order-id-display').innerText = orderId;

        const container = document.querySelector('.order-success-card');
        const invoiceBtn = document.createElement('button');
        invoiceBtn.className = "vibe-btn";
        invoiceBtn.style.marginTop = "20px";
        invoiceBtn.style.background = "var(--accent)"; 
        invoiceBtn.style.color = "white"; 
        invoiceBtn.style.border = "none";
        invoiceBtn.innerHTML = "Download Invoice 📄";
        invoiceBtn.onclick = () => generateInvoice(orderId, finalTotal, itemsList);
        container.appendChild(invoiceBtn);

        cart = {};
        localStorage.removeItem('myCart');
        updateCartUI();
    }, 2000);
}

function generateInvoice(id, total, items) {
    const content = `
    DIGI-ADDA OFFICIAL INVOICE
    --------------------------
    Order ID: ${id}
    Date: ${new Date().toLocaleDateString()}
    
    Items Purchased:
    ${items}
    
    --------------------------
    TOTAL: ${total}
    Payment: Verified via Razorpay
    --------------------------
    Thanks for shopping with Digi-Adda!
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${id}.txt`;
    link.click();
}