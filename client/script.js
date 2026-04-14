console.log("Script loaded successfully!");

let currentProducts = [];
let originalProducts = [];
let isSearching = false; // Track if user is searching

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded");
    initializeApp();
});

function initializeApp() {
    console.log("Initializing app...");
    loadProducts(); // displayRecentlyViewed is called inside after products load
}

function hideLoader() {
    const loader = document.getElementById("loadingOverlay");
    if (loader) {
        loader.style.display = "none";
    }
}

async function loadProducts() {
    console.log("Loading products...");

    try {
        const timestamp = Date.now();
        const response = await fetch(`/api/products?t=${timestamp}`);

        if (!response.ok) {
            throw new Error(`Server error ${response.status}`);
        }

        const products = await response.json();
        console.log("Products:", products);

        currentProducts = products;
        originalProducts = [...products]; // Store original products

        displayProducts(products);
        displayRecentlyViewed(); // Called here so it can filter against live products
        hideLoader();

    } catch (error) {
        console.error("Error loading products:", error);

        const container = document.getElementById("productGrid");

        if (container) {
            container.innerHTML = `
                <div style="text-align:center;padding:40px">
                    <h3>Error Loading Products</h3>
                    <p>${error.message}</p>
                    <button onclick="loadProducts()">Retry</button>
                </div>
            `;
        }

        hideLoader();
    }
}

function displayProducts(products) {

    const container = document.getElementById("productGrid");
    const countElement = document.getElementById("productCount");

    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>No products available</p>";
        return;
    }

    products.forEach(product => {

        const div = document.createElement("div");
        div.className = "product-card";

        div.innerHTML = `
            <div class="product-image">
                <img src="${product.image}"
                alt="${product.name}"
                onerror="this.src='https://picsum.photos/seed/flower/300/200'">
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>

                <div class="price-whatsapp">
                    <span class="price">₹${product.priceMedium || product.price || 'N/A'}</span>

                    <a href="https://wa.me/919747577095?text=${encodeURIComponent(`Enquiry for ${product.name}${product.productCode ? ` [SKU: ${product.productCode}]` : ''}: I'd like to check details for this arrangement.\n\nProduct Link: ${window.location.origin}${product.image}`)}"
                    target="_blank"
                    class="whatsapp-icon">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                </div>

                <div class="size-options">
                    <label>Size:</label>
                    <div class="size-buttons">
                        <button class="size-btn" data-size="small" data-price="${product.priceSmall || (product.price ? product.price * 0.8 : 'N/A')}">S</button>
                        <button class="size-btn active" data-size="medium" data-price="${product.priceMedium || product.price || 'N/A'}">M</button>
                        <button class="size-btn" data-size="large" data-price="${product.priceLarge || (product.price ? product.price * 1.2 : 'N/A')}">L</button>
                    </div>
                </div>

                <button class="shop-now-btn"
                onclick="shopNow('${product._id}','${product.name}')">
                    Shop Now
                </button>
            </div>
        `;

        container.appendChild(div);

    });

    // Add event listeners for size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons in the same product card
            const parent = this.closest('.size-buttons');
            parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update price
            const card = this.closest('.product-card');
            const priceElement = card.querySelector('.price');
            const newPrice = this.getAttribute('data-price');
            priceElement.textContent = `₹${newPrice}`;
        });
    });

    if (countElement) {
        countElement.textContent = products.length;
    }

}

function displayRecentlyViewed() {

    const container = document.querySelector(".recent-products-grid");
    const section = document.querySelector(".recently-viewed");
    if (!container) return;

    let viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");

    // Cross-check against live products — remove any that have been deleted from DB
    const liveIds = new Set(originalProducts.map(p => p._id));
    const validViewed = viewed.filter(p => liveIds.has(p._id));

    // Update localStorage to remove stale entries
    if (validViewed.length !== viewed.length) {
        localStorage.setItem("recentlyViewed", JSON.stringify(validViewed));
    }

    container.innerHTML = "";

    if (validViewed.length === 0) {
        // Hide the whole section if nothing to show
        if (section) section.style.display = "none";
        return;
    }

    if (section) section.style.display = "";

    validViewed.forEach(product => {

        const div = document.createElement("div");
        div.className = "recent-product-card";

        // Use priceMedium as fallback for the price field
        const displayPrice = product.priceMedium || product.price || 'N/A';

        div.innerHTML = `
            <img src="${product.image}"
            alt="${product.name}"
            onerror="this.src='https://picsum.photos/seed/flower/150/150'">

            <h4>${product.name}</h4>
            <p class="price">₹${displayPrice}</p>
            <button class="shop-now-btn" onclick="shopNow('${product._id}','${product.name}')">
                View Details
            </button>
        `;

        div.onclick = () => shopNow(product._id, product.name);

        container.appendChild(div);

    });

}

function shopNow(productId, productName) {

    console.log("Opening product:", productName);

    let selected = currentProducts.find(p => p._id === productId);

    if (!selected) {
        const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
        selected = viewed.find(p => p._id === productId);
    }

    if (selected) {

        localStorage.setItem("selectedProduct", JSON.stringify(selected));

        let viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");

        viewed = viewed.filter(p => p._id !== selected._id);
        viewed.unshift(selected);
        viewed = viewed.slice(0, 6);

        localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
    }

    window.location.href = `/product-detail.html?id=${productId}`;
}

// Search functionality
window.searchProducts = function() {
    const searchTerm = document.querySelector('.search-bar input').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        // Empty search, show all products
        currentProducts = [...originalProducts];
        displayProducts(currentProducts);
    } else {
        // Active search
        isSearching = true;
        const filteredProducts = originalProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        
        currentProducts = filteredProducts; // Update current products for sorting
        displayProducts(filteredProducts);
    }
}

// Sort functionality
window.sortProducts = function() {
    const sortValue = document.getElementById('sortSelect').value;
    let sortedProducts = [...currentProducts];
    
    switch(sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Keep original order
            break;
    }
    
    displayProducts(sortedProducts);
}

// Auto-refresh products every 10 seconds (reduced from 3 for better performance)
setInterval(() => {
    console.log("Auto refresh triggered");
    // Only refresh if user is not actively searching
    if (!isSearching) {
        loadProducts();
    }
}, 10000);