// [WAJIB] Database Menu Restoran - Minimal 10 Item Berbeda (Makanan & Minuman)
const databaseMenu = [
    { id: 1, name: "Lize Classic Burger", price: 35000, category: "makanan", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400" },
    { id: 2, name: "Cheese Blast Fries", price: 22000, category: "makanan", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=400" },
    { id: 3, name: "Crispy Chicken Strips", price: 28000, category: "makanan", image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400" },
    { id: 4, name: "Grilled Beef Sausage", price: 25000, category: "makanan", image: "https://images.unsplash.com/photo-1532246420286-127bcd803104?q=80&w=400" },
    { id: 5, name: "Lize Croissant Waffle Ice Cream", price: 24000, category: "makanan", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=400" }, // Nama Menu Sudah Diperbarui
    { id: 6, name: "Premium Iced Matcha Latte", price: 20000, category: "minuman", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=400" },
    { id: 7, name: "Signature Aren Coffee", price: 18000, category: "minuman", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400" },
    { id: 8, name: "Fresh Sparkling Berry", price: 19000, category: "minuman", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400" },
    { id: 9, name: "Tropical Mango Smoothies", price: 22000, category: "minuman", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=400" },
    { id: 10, name: "Earl Grey Milk Tea", price: 17000, category: "minuman", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400" }
];

// Array Penampung Keranjang Belanja
let cart = [];
let targetWhatsAppNumber = "6281289012311"; // Ganti dengan nomor WhatsApp Anda untuk simulasi
let finalReceiptData = ""; // Untuk menampung teks mentah WA

// 1. Fungsi Merender Menu dengan Filter Kategori
function renderMenu(filter = "semua") {
    const container = document.getElementById('menu-container');
    container.innerHTML = "";

    databaseMenu.forEach(item => {
        if (filter === "semua" || item.category === filter) {
            container.innerHTML += `
                <div class="menu-card">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="menu-details">
                        <h3>${item.name}</h3>
                        <p class="price">Rp ${item.price.toLocaleString('id-ID')}</p>
                        <button class="btn-add-cart" onclick="addToCart(${item.id})">Tambah ke Keranjang</button>
                    </div>
                </div>
            `;
        }
    });
}

function filterMenu(category) {
    // Beri class aktif pada button filter yang diklik
    const buttons = document.querySelectorAll('.btn-filter');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderMenu(category);
}

// 2. Fungsi Manajemen Kuantitas Keranjang (Tambah, Kurang, Hapus)
function addToCart(id) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        const product = databaseMenu.find(p => p.id === id);
        cart.push({ ...product, qty: 1 });
    }
    updateCart();
}

function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

// 3. Fungsi Hitung Otomatis (Subtotal, Layanan, Ongkir, Total)
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = "";
    
    let subtotal = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `<tr><td colspan="5" style="text-align:center; color: #9ca3af;">Keranjang belanja masih kosong.</td></tr>`;
    } else {
        cart.forEach((item, index) => {
            let itemSubtotal = item.price * item.qty;
            subtotal += itemSubtotal;
            
            cartItems.innerHTML += `
                <tr>
                    <td data-label="Produk"><strong>${item.name}</strong></td>
                    <td data-label="Harga">Rp ${item.price.toLocaleString('id-ID')}</td>
                    <td data-label="Jumlah">
                        <div class="qty-control">
                            <button class="btn-qty" onclick="changeQty(${index}, -1)">-</button>
                            <span>${item.qty}</span>
                            <button class="btn-qty" onclick="changeQty(${index}, 1)">+</button>
                        </div>
                    </td>
                    <td data-label="Subtotal">Rp ${itemSubtotal.toLocaleString('id-ID')}</td>
                    <td data-label="Aksi">
                        <button class="btn-del" onclick="cart.splice(${index}, 1); updateCart();">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    // Kalkulasi Biaya Aturan Bisnis (Konteks Layanan)
    const layanan = document.getElementById('layanan').value;
    let biayaLayanan = subtotal > 0 ? 3000 : 0; 
    let ongkir = (layanan === 'delivery' && subtotal > 0) ? 12000 : 0; 
    let totalAkhir = subtotal + biayaLayanan + ongkir;

    // Tampilkan Ke Komponen HTML Rincian Biaya
    document.getElementById('bill-subtotal').innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('bill-service').innerText = `Rp ${biayaLayanan.toLocaleString('id-ID')}`;
    document.getElementById('bill-shipping').innerText = `Rp ${ongkir.toLocaleString('id-ID')}`;
    document.getElementById('bill-total').innerText = `Rp ${totalAkhir.toLocaleString('id-ID')}`;
}

// Menangani Perubahan Pilihan Layanan (Tampilkan form Alamat jika Delivery)
function handleLayananChange() {
    const layanan = document.getElementById('layanan').value;
    const addressContainer = document.getElementById('address-container');
    const inputAlamat = document.getElementById('alamat');

    if (layanan === 'delivery') {
        addressContainer.style.display = 'block';
        inputAlamat.setAttribute('required', 'true');
    } else {
        addressContainer.style.display = 'none';
        inputAlamat.removeAttribute('required');
    }
    updateCart(); 
}

// 4. Form Validasi & Pengeluaran Cetak Struk Konfirmasi
function processCheckout(event) {
    event.preventDefault(); 

    if (cart.length === 0) {
        alert("Gagal melakukan checkout! Keranjang belanja Anda kosong.");
        return;
    }

    // Ambil Nilai Form Input
    const nama = document.getElementById('nama').value;
    const telepon = document.getElementById('telepon').value;
    const layanan = document.getElementById('layanan').options[document.getElementById('layanan').selectedIndex].text;
    const pembayaran = document.getElementById('pembayaran').options[document.getElementById('pembayaran').selectedIndex].text;
    const alamat = document.getElementById('alamat').value;
    const catatan = document.getElementById('catatan').value || "-";

    // Hitung Nominal Akhir
    let subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let biayaLayanan = 3000;
    let ongkir = document.getElementById('layanan').value === 'delivery' ? 12000 : 0;
    let totalAkhir = subtotal + biayaLayanan + ongkir;

    // Bangun Desain Teks Tampilan Struk di Halaman Web
    const receiptContent = document.getElementById('receipt-content');
    let itemsHtml = "";
    cart.forEach(item => {
        itemsHtml += `<div class="receipt-row"><span>${item.name} (x${item.qty})</span><span>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span></div>`;
    });

    receiptContent.innerHTML = `
        <div class="receipt-row"><span>Pelanggan:</span><strong>${nama}</strong></div>
        <div class="receipt-row"><span>Telepon:</span><span>${telepon}</span></div>
        <div class="receipt-row"><span>Layanan:</span><span>${layanan}</span></div>
        <div class="receipt-row"><span>Metode Bayar:</span><span>${pembayaran}</span></div>
        ${document.getElementById('layanan').value === 'delivery' ? `<div class="receipt-row"><span>Alamat Kirim:</span><span>${alamat}</span></div>` : ''}
        <div class="receipt-row"><span>Catatan Koki:</span><span>${catatan}</span></div>
        <hr style="border:1px dashed #d1d5db; margin:10px 0;">
        ${itemsHtml}
        <hr style="border:1px dashed #d1d5db; margin:10px 0;">
        <div class="receipt-row"><span>Subtotal:</span><span>Rp ${subtotal.toLocaleString('id-ID')}</span></div>
        <div class="receipt-row"><span>Biaya Layanan:</span><span>Rp ${biayaLayanan.toLocaleString('id-ID')}</span></div>
        <div class="receipt-row"><span>Ongkos Kirim:</span><span>Rp ${ongkir.toLocaleString('id-ID')}</span></div>
        <div class="receipt-row" style="font-weight:bold; color:#d97706;"><span>Total Bayar:</span><span>Rp ${totalAkhir.toLocaleString('id-ID')}</span></div>
    `;

    // Tampilkan Section Struk Ke Layar Browser
    document.getElementById('receipt-section').style.display = 'block';
    document.getElementById('receipt-section').scrollIntoView({ behavior: 'smooth' });

    // Buat Template String WhatsApp Text
    let waText = `*STRUK PEMESANAN LAZE RESTO*\n`;
    waText += `=========================\n`;
    waText += `• *Nama Pelanggan:* ${nama}\n`;
    waText += `• *No Telepon:* ${telepon}\n`;
    waText += `• *Jenis Layanan:* ${layanan}\n`;
    waText += `• *Metode Bayar:* ${pembayaran}\n`;
    if(document.getElementById('layanan').value === 'delivery') waText += `• *Alamat:* ${alamat}\n`;
    waText += `• *Catatan:* ${catatan}\n`;
    waText += `=========================\n`;
    waText += `*DAFTAR MENU:*\n`;
    cart.forEach(item => {
        waText += `- ${item.name} (x${item.qty}) : Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n`;
    });
    waText += `=========================\n`;
    waText += `• Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n`;
    waText += `• Biaya Layanan: Rp ${biayaLayanan.toLocaleString('id-ID')}\n`;
    waText += `• Ongkos Kirim: Rp ${ongkir.toLocaleString('id-ID')}\n`;
    waText += `*TOTAL PEMBAYARAN: Rp ${totalAkhir.toLocaleString('id-ID')}*\n`;

    finalReceiptData = encodeURIComponent(waText);
}

// 5. Kirim data Struk Pembelian Menuju API WhatsApp Web
function sendToWhatsApp() {
    if(!finalReceiptData) return;
    window.open(`https://api.whatsapp.com/send?phone=${targetWhatsAppNumber}&text=${finalReceiptData}`, '_blank');
}

// Booting Awal Aplikasi saat browser dimuat
renderMenu();
updateCart();