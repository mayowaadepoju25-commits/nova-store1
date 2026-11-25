
const products = [

    {
        id: 1,
        name: "Wireless Headphones",
        category: "Tech",
        price: 68500,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },

    {
        id: 2,
        name: "Water Bottle",
        category: "Lifestyle",
        price: 18500,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600"
    },

    {
        id: 3,
        name: "Modern Desk Lamp",
        category: "Lifestyle",
        price: 42500,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"
    },

    {
        id: 4,
        name: "Leather Handbag",
        category: "Accessories",
        price: 32000,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"
    },

    {
        id: 5,
        name: "Wireless Charger",
        category: "Tech",
        price: 27500,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600"
    },

    {
        id: 6,
        name: "Classic Wristwatch",
        category: "Accessories",
        price: 59000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },

    {
        id: 7,
        name: "Notebook Set",
        category: "Lifestyle",
        price: 12500,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600"
    },

    {
        id: 8,
        name: "Bluetooth Speaker",
        category: "Tech",
        price: 48000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
    }

];

// Format Nigerian currency

function formatPrice(price) {

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(price);

}

// Shopping cart

let cart = JSON.parse(
    localStorage.getItem("nova-cart") || "[]"
);

let selectedCategory = "All";

// HTML elements

const productGrid =
    document.getElementById("product-grid");

const cartCount =
    document.getElementById("cart-count");

const cartItems =
    document.getElementById("cart-items");

const subtotal =
    document.getElementById("subtotal");


// Display products

function displayProducts() {

    const searchValue =
        document.getElementById("search-input")
        .value.toLowerCase();

    let filteredProducts = products.filter(product => {

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue);

        return matchesCategory && matchesSearch;

    });

    // Sorting products

    const sortValue =
        document.getElementById("sort-select").value;

    if (sortValue === "low") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    }

    if (sortValue === "high") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    }

    // Display products

    productGrid.innerHTML = filteredProducts.map(product => `

        <div class="product-card">

            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <span class="product-rating">
                        ★ ${product.rating}
                    </span>

                </div>

                <button
                    class="add-button"
                    data-add="${product.id}"
                >
                    Add to Bag +
                </button>

            </div>

        </div>

    `).join("");

    document.getElementById("empty-state")
        .classList.toggle(
            "hidden",
            filteredProducts.length !== 0
        );

}


// Add product to cart

function addToCart(id) {

    const existingProduct =
        cart.find(item => item.id === id);

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }

    saveCart();

    alert("Product added to your shopping bag!");

}


// Save cart

function saveCart() {

    localStorage.setItem(
        "nova-cart",
        JSON.stringify(cart)
    );

    displayCart();

}


// Display shopping cart

function displayCart() {

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {

        const product =
            products.find(p => p.id === item.id);

        if (!product) return;

        totalItems += item.quantity;

        totalPrice +=
            product.price * item.quantity;

    });

    cartCount.textContent = totalItems;

    subtotal.textContent =
        formatPrice(totalPrice);


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-empty">
                Your shopping bag is empty.
                <br><br>
                Start exploring our products!
            </div>
        `;

        return;

    }


    cartItems.innerHTML = cart.map(item => {

        const product =
            products.find(p => p.id === item.id);

        if (!product) return "";

        return `

            <div class="cart-row">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div>

                    <h3>${product.name}</h3>

                    <p>
                        ${formatPrice(product.price)}
                    </p>

                    <div class="quantity">

                        <button data-minus="${product.id}">
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button data-plus="${product.id}">
                            +
                        </button>

                    </div>

                    <button
                        class="remove-item"
                        data-remove="${product.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;

    }).join("");

}


// Change product quantity

function changeQuantity(id, amount) {

    const item =
        cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        cart = cart.filter(
            product => product.id !== id
        );

    }

    saveCart();

}


// Remove product

function removeFromCart(id) {

    cart = cart.filter(
        product => product.id !== id
    );

    saveCart();

}


// Category filtering

document.getElementById("categories")
.addEventListener("click", function(event) {

    const button =
        event.target.closest("[data-category]");

    if (!button) return;

    selectedCategory = button.dataset.category;

    document.querySelectorAll(".categories button")
    .forEach(btn => {

        btn.classList.remove("active");

    });

    button.classList.add("active");

    displayProducts();

});


// Product buttons

productGrid.addEventListener("click", function(event) {

    const button =
        event.target.closest("[data-add]");

    if (!button) return;

    addToCart(Number(button.dataset.add));

});


// Cart quantity and remove buttons

cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.plus) {

        changeQuantity(
            Number(button.dataset.plus),
            1
        );

    }

    if (button.dataset.minus) {

        changeQuantity(
            Number(button.dataset.minus),
            -1
        );

    }

    if (button.dataset.remove) {

        removeFromCart(
            Number(button.dataset.remove)
        );

    }

});


// Search

document.getElementById("search-input")
.addEventListener("input", displayProducts);


// Sorting

document.getElementById("sort-select")
.addEventListener("change", displayProducts);


// Open shopping cart

const cartDrawer =
    document.getElementById("cart-drawer");

const overlay =
    document.getElementById("overlay");

function openCart() {

    cartDrawer.classList.add("open");

    overlay.classList.remove("hidden");

}

function closeCart() {

    cartDrawer.classList.remove("open");

    overlay.classList.add("hidden");

}

document.getElementById("cart-button")
.addEventListener("click", openCart);

document.getElementById("close-cart")
.addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);


// Checkout


// Checkout
document.getElementById("checkout-button")
.addEventListener("click", function() {

    if (cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }

    // Collect product details for the checkout page
    const checkoutItems = cart.map(item => {

        const product = products.find(p => p.id === item.id);

        return {
            ...product,
            quantity: item.quantity
        };

    });

    // Save checkout information
    localStorage.setItem(
        "nova-checkout",
        JSON.stringify(checkoutItems)
    );

    // Close cart and open checkout page
    closeCart();

    window.location.href = "checkout.html";

});



// Place demo order

document.getElementById("checkout-form")
.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!this.reportValidity()) return;

    alert(
        "Thank you for shopping with Nova Store! " +
        "This is a demo order. No payment was collected."
    );

    cart = [];

    saveCart();

    this.reset();

    checkoutModal.close();

});


// Newsletter

document.getElementById("newsletter-form")
.addEventListener("submit", function(event) {

    event.preventDefault();

    document.getElementById("newsletter-message")
    .textContent =
        "Thank you for subscribing! This is a demo signup.";

    this.reset();

});


// Mobile navigation

document.getElementById("menu-button")
.addEventListener("click", function() {

    document.getElementById("navigation")
    .classList.toggle("show");

});


// Close mobile navigation after clicking a link

document.querySelectorAll("#navigation a")
.forEach(link => {

    link.addEventListener("click", function() {

        document.getElementById("navigation")
        .classList.remove("show");

    });

});


// Start website

displayProducts();

displayCart();

