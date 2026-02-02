// Theme Persistence Logic
const currentTheme = localStorage.getItem('theme') || 'light-mode';
document.body.className = currentTheme;

document.getElementById('theme-toggle').addEventListener('click', () => {
    const newTheme = document.body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
});

// Link products to Detail Page (Update your initCatalog function loop)
// Change the <h3> to: <h3 onclick="viewProduct(${p.id})" style="cursor:pointer">${p.name}</h3>
function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

const products = [
    { id: 1, name: "BassPro Earbuds", price: 1499, imgID: "1590658268037-6bf12165a8df", desc: "Heavy bass, light on the pocket." },
    { id: 2, name: "FitBand Lite", price: 999, imgID: "1575311373937-040b8e1fd5b6", desc: "Track steps, not just time." },
    { id: 3, name: "10k mAh PowerBrick", price: 799, imgID: "1609091839311-d536819bc248", desc: "Reliable juice for long days." },
    { id: 4, name: "Silent Click Mouse", price: 499, imgID: "1527864550417-7fd91fc51a46", desc: "Work in peace, zero noise." },
    { id: 5, name: "RGB Desk Strip", price: 399, imgID: "1550009158-9ebf69173e03", desc: "Instant mood lighting for your setup." },
    { id: 6, name: "Laptop Stand Pro", price: 1199, imgID: "1527443224154-c4a3942d3acf", desc: "Save your neck, work better." },
    { id: 10, name: "Gaming Pad XL", price: 599, imgID: "1616628188502-413f2fe46e5e", desc: "Smooth glide for high stakes." },
    { id: 11, name: "Smart Bulb (WiFi)", price: 699, imgID: "1550985616-10810253b84d", desc: "Control your room from your phone." },
    { id: 7, name: "Mini BT Speaker", price: 899, imgID: "1608156639585-34054e815958", desc: "Pocket-sized party starter." },
    { id: 8, name: "Type-C Braided Cable", price: 299, imgID: "1588505794041-9c35a630985a", desc: "Unbreakable charging solution." },
    { id: 13, name: "Wireless Keyboard", price: 1899, imgID: "1587829741301-dc798b83dadc", desc: "Clean desk, no wires." },
    { id: 14, name: "USB Hub 4-Port", price: 650, imgID: "1618410313554-15962776856c", desc: "Connect everything at once." },
    { id: 12, name: "Phone Tripod Mount", price: 450, imgID: "1586105251261-72a756654ff1", desc: "Perfect for steady reels." },
    { id: 15, name: "Earphone Hard Case", price: 199, imgID: "1544650030-3c51ad35730d", desc: "Protect your audio gear." },
    { id: 16, name: "Cable Organizer Clip", price: 99, imgID: "1591485423007-765bde4139ef", desc: "Tame the wire jungle." },
    { id: 9, name: "Webcam Privacy Cover", price: 149, imgID: "1585338107529-13afc5f02586", desc: "Secure your space instantly." }
];

let cart = {};

// Failsafe: If an image fails to load, use a generic tech placeholder
function handleImgError(image) {
    image.onerror = "";
    image.src = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500";
    return true;
}

function initCatalog() {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = products.map(p => {
        // Constructing the URL using the specific ID for maximum reliability
        const imgUrl = `https://images.unsplash.com/photo-${p.imgID}?auto=format&fit=crop&w=500&q=80`;
        
        return `
            <div class="card">
                <img src="${imgUrl}" alt="${p.name}" onerror="handleImgError(this)" loading="lazy">
                <h3>${p.name}</h3>
                <p style="color: var(--text-dim); font-size: 0.8rem; margin: 5px 0;">${p.desc}</p>
                <div class="price">₹${p.price.toLocaleString('en-IN')}</div>
                <button class="add-btn" onclick="addToCart(${p.id})">Add to Bag</button>
            </div>
        `;
    }).join('');
}

// ... rest of your cart and theme toggle logic remains the same ...

function addToCart(id) {
    if (cart[id]) {
        cart[id].qty += 1;
    } else {
        const product = products.find(p => p.id === id);
        cart[id] = { ...product, qty: 1 };
    }
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    
    let totalItems = 0, totalPrice = 0;
    list.innerHTML = "";

    Object.values(cart).forEach(item => {
        totalItems += item.qty;
        totalPrice += (item.price * item.qty);
        list.innerHTML += `
            <div class="cart-item">
                <div style="flex:1">
                    <div style="font-weight:700">${item.name}</div>
                    <div style="font-size: 0.85rem">₹${item.price.toLocaleString('en-IN')}</div>
                    <div style="margin-top:8px">
                        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                        <span style="margin: 0 10px">${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div style="font-weight:700">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
            </div>
        `;
    });

    countEl.innerText = totalItems;
    totalEl.innerText = `₹${totalPrice.toLocaleString('en-IN')}`;
}

function changeQty(id, delta) {
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('active');
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

initCatalog();
