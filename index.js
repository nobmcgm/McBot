const mineflayer = require('mineflayer');

// --- KONFIGURASI ---
const SERVER_HOST = 'nightnb.aternos.me'; // Ganti IP server Minecraft
const SERVER_PORT = 16409;       // Ganti Port
const BOT_COUNT = 10;           // Jumlah bot
const AUTH_MODE = 'offline';     // 'offline' untuk cracked, 'microsoft' untuk premium

// Fungsi untuk menghasilkan nama acak dengan format gggXXX
function generateRandomName() {
    // Menghasilkan angka acak antara 1 sampai 999
    const randomNum = Math.floor(Math.random() * 999) + 1;
    // Padkan dengan nol di depan (misal: 5 menjadi "005", 50 menjadi "050")
    const paddedNum = String(randomNum).padStart(3, '0');
    return `ggg${paddedNum}`;
}

// Fungsi utama untuk membuat dan mengelola bot
function createBot() {
    const username = generateRandomName();
    
    console.log(`Mencoba menghubungkan bot: ${username}...`);

    const bot = mineflayer.createBot({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        version: false, // Auto-detect versi
        auth: AUTH_MODE
    });

    // Event: Berhasil Login
    bot.on('login', () => {
        console.log(`[SUKSES] ${username} berhasil login.`);
    });

    // Event: Spawn di dunia
    bot.on('spawn', () => {
        // Opsional: Bot melakukan sesuatu saat spawn
        // bot.chat(`Halo dari ${username}`);
    });

    // Event: Koneksi Terputus / Dikick
    bot.on('end', (reason) => {
        console.warn(`[PUTUS] ${username} terputus. Alasan: ${reason}`);
        console.log(`[RECONNECT] ${username} mencoba masuk kembali dalam 5 detik...`);
        
        // Coba reconnect setelah jeda 5 detik (5000 ms)
        setTimeout(() => {
            createBot(); // Panggil fungsi ini lagi untuk membuat bot baru dengan nama baru
        }, 2000);
    });

    // Event: Error (Misal: gagal konek awal)
    bot.on('error', (err) => {
        console.error(`[ERROR] ${username} mengalami error: ${err.message}`);
        // Jika error fatal, coba reconnect juga
        setTimeout(() => {
            createBot();
        }, 2000);
    });

    // Event: Kicked secara spesifik
    bot.on('kicked', (reason, loggedIn) => {
        console.warn(`[KICKED] ${username} ditendang: ${reason}`);
        // Logika reconnect sudah ditangani oleh event 'end', jadi tidak perlu double call
    });
}

// --- EKSEKUSI ---
console.log(`Memulai pembuatan ${BOT_COUNT} bot dengan nama acak...`);

for (let i = 0; i < BOT_COUNT; i++) {
    createBot();
    
    // PENTING: Beri jeda antar koneksi awal agar server tidak overload
    // Jeda 100ms - 300ms biasanya aman untuk localhost/VPS kuat
    // Jika server remote/lambat, naikkan ke 1000ms (1 detik)
}
