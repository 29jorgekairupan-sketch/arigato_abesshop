// Variabel global untuk menyimpan data keranjang belanja
let cart = [];

// ====================================
// 1. FUNGSI UTAMA KERANJANG BELANJA
// ====================================

/**
 * Menambahkan item ke keranjang dan memperbarui tampilan.
 * @param {string} id - ID unik produk
 * @param {string} name - Nama produk
 * @param {number} price - Harga produk
 */
function addToCart(id, name, price) {
    // Cek apakah item sudah ada di keranjang (asumsi mobil limited, hanya 1 unit per tipe)
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        alert(`The ${name} is a limited-edition vehicle. You can only inquire about one unit at a time.`);
    } else {
        // Tambahkan item baru ke keranjang
        cart.push({ id, name, price, quantity: 1 });
        alert(`${name} added to your Inquiry Cart.`);
    }

    updateCartDisplay();
}

/**
 * Memperbarui tampilan Keranjang Belanja (popup, count, total).
 */
function updateCartDisplay() {
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Hitung total item dan total harga
    const totalItems = cart.length;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Perbarui jumlah item di header
    cartCountElement.textContent = totalItems;

    // Perbarui daftar item di pop-up
    cartItemsElement.innerHTML = ''; // Kosongkan daftar item

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<li>Your cart is empty.</li>';
        cartTotalElement.textContent = '0.00';
    } else {
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price.toLocaleString('en-US')}</span>
            `;
            cartItemsElement.appendChild(listItem);
        });

        // Perbarui total harga
        cartTotalElement.textContent = total.toLocaleString('en-US', { minimumFractionDigits: 2 });
    }
}

// ====================================
// 2. EVENT LISTENERS
// ====================================
document.addEventListener('DOMContentLoaded', () => {

    // A. Toggle Menu Mobile
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        // Tutup cart popup saat menu dibuka
        document.getElementById('cart-popup').style.display = 'none'; 
    });

    // B. Toggle Keranjang Pop-up
    const cartBtn = document.getElementById('cart-btn');
    const cartPopup = document.getElementById('cart-popup');

    cartBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Mencegah klik menyebar ke document
        cartPopup.style.display = cartPopup.style.display === 'block' ? 'none' : 'block';
        // Tutup mobile menu saat cart dibuka
        mainNav.classList.remove('active');
    });

    // Tutup cart pop-up jika mengklik di luar
    document.addEventListener('click', (e) => {
        if (!cartPopup.contains(e.target) && e.target !== cartBtn && !cartBtn.contains(e.target)) {
            cartPopup.style.display = 'none';
        }
    });


    // C. Tambahkan Event Listener untuk Tombol 'Add to Cart'
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Ambil data dari elemen product-card terdekat
            const card = button.closest('.product-card');
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            // Ambil dan ubah harga dari string menjadi number
            const priceStr = card.getAttribute('data-price');
            const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')); 

            if (id && name && price) {
                addToCart(id, name, price);
            }
        });
    });

    // D. Fungsionalitas Checkout Button (Arahkan ke WhatsApp)
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add a model to your inquiry.');
            return;
        }

        // Buat pesan WhatsApp dengan daftar mobil yang diminati
        const cartItemsList = cart.map(item => `- ${item.name} ($${item.price.toLocaleString('en-US')})`).join('\n');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        let message = `Hello LiamBes Team,\n\nI am interested in the following exclusive Indonesian vehicles:\n${cartItemsList}\n\nTotal Estimated Value: $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\nPlease contact me to discuss details, shipping (US/EU), and payment options.\n\nMy Name: (Your Full Name)\nMy Location: (Your City, Country)`;
        
        // Encode pesan untuk URL
        const encodedMessage = encodeURIComponent(message);
        
        // Nomor WhatsApp tujuan: +6283194686230
        const whatsappNumber = '6283194686230';
        
        // Redirect ke WhatsApp
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    });

    // E. Handle form submission (Contact Us)
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Tampilkan pesan sukses dan reset form
        alert('Thank you for your exclusive inquiry! We will contact you within 24 hours to discuss the details of your desired vehicle.');
        contactForm.reset();
    });


    // Inisialisasi tampilan keranjang saat load
    updateCartDisplay();
});