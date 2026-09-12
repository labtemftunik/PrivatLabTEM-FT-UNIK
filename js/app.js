const SANDI = "#";

// ===============================
// LOAD HALAMAN
// ===============================

function loadPage(page) {

    fetch("pages/" + page + ".html")
        .then(response => {

            if (!response.ok) {
                throw new Error("Halaman tidak ditemukan");
            }

            return response.text();
        })
        .then(html => {

            document.getElementById("content").innerHTML = html;

        })
        .catch(error => {

            console.error(error);

            document.getElementById("content").innerHTML = `
                <div class="text-center mt-5">
                    <h3>Halaman tidak ditemukan</h3>
                </div>
            `;

        });
}


// ===============================
// ROUTER
// ===============================

function router() {

    let page = location.hash.replace("#", "");

    if (page === "") {
        page = "login";
    }

    loadPage(page);
}


// ===============================
// LOGIN
// ===============================

function login() {

    const sandi = document.getElementById("sandi").value;
    const pesan = document.getElementById("pesanLogin");

    if (!sandi) {

        pesan.innerHTML = `
            <div class="text-danger">
                Masukkan sandi.
            </div>
        `;

        return;
    }


    if (sandi === SANDI) {

        location.hash = "#home";

    } else {

        pesan.innerHTML = `
            <div class="text-danger">
                Sandi salah.
            </div>
        `;

    }

}

// ========================================
// KONFIGURASI GOOGLE APPS SCRIPT
// ========================================

const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbzPA9TFqv0wT4bU73jop9Tvzh3flABBkC-8oFXQkJFZ9k5d2XtEbdBtiWRNx1m8G_S0yQ/exec";

// ========================================
// PEMINJAMAN ALAT
// ========================================

function loadPinjamAlat() {

const daftarMenunggu =
    document.getElementById("daftarMenunggu");

const daftarDipinjam =
    document.getElementById("daftarDipinjam");

if (!daftarMenunggu || !daftarDipinjam) {
    return;
}


fetch(URL_APPS_SCRIPT)
    .then(response => response.json())
    .then(result => {

        if (!result.success) {
            throw new Error(result.message);
        }

        tampilkanDataPinjamAlat(result.data);

    })
    .catch(error => {

        console.error(error);

        daftarMenunggu.innerHTML = `
            <div class="text-danger">
                Gagal memuat data peminjaman.
            </div>
        `;

        daftarDipinjam.innerHTML = `
            <div class="text-danger">
                Gagal memuat data peminjaman.
            </div>
        `;

    });

}

// ========================================
// TAMPILKAN DATA
// ========================================

function tampilkanDataPinjamAlat(data) {

const daftarMenunggu =
    document.getElementById("daftarMenunggu");

const daftarDipinjam =
    document.getElementById("daftarDipinjam");

const jumlahMenunggu =
    document.getElementById("jumlahMenunggu");

const jumlahDipinjam =
    document.getElementById("jumlahDipinjam");


if (!daftarMenunggu || !daftarDipinjam) {
    return;
}


daftarMenunggu.innerHTML = "";
daftarDipinjam.innerHTML = "";


let dataMenunggu = [];
let dataDipinjam = [];


data.forEach(function(item) {

    if (item.status === "Menunggu") {
        dataMenunggu.push(item);
    }

    if (item.status === "Dipinjam") {
        dataDipinjam.push(item);
    }

});


// ========================================
// JUMLAH DATA
// ========================================

if (jumlahMenunggu) {
    jumlahMenunggu.textContent =
        dataMenunggu.length;
}

if (jumlahDipinjam) {
    jumlahDipinjam.textContent =
        dataDipinjam.length;
}


// ========================================
// JIKA TIDAK ADA DATA
// ========================================

if (dataMenunggu.length === 0) {

    daftarMenunggu.innerHTML = `
        <div class="empty-data">
            <i class="bi bi-inbox"></i>
            <p>Tidak ada peminjaman yang menunggu konfirmasi.</p>
        </div>
    `;

}


if (dataDipinjam.length === 0) {

    daftarDipinjam.innerHTML = `
        <div class="empty-data">
            <i class="bi bi-check-circle"></i>
            <p>Tidak ada alat yang sedang dipinjam.</p>
        </div>
    `;

}


// ========================================
// DATA MENUNGGU
// ========================================

dataMenunggu.forEach(function(item) {

    const card = document.createElement("div");

    card.className = "pinjam-card";

    card.innerHTML = `
        <div class="pinjam-card-content">

                    <h4>${item.nama}</h4>

                    <p>
                        <strong>NIM:</strong>
                        ${item.nim}
                    </p>

                    <p>
                        <strong>Alat:</strong>
                        ${item.namaAlat}
                    </p>

                    <p>
                        <strong>Jumlah:</strong>
                        ${item.jumlah}
                    </p>

                    <p>
                        <strong>Keperluan:</strong>
                        ${item.keperluan}
                    </p>

                    <p>
                        <strong>Tanggal Pinjam:</strong>
                        ${item.tanggalPinjam}
                    </p>

                </div>

                <div class="pinjam-card-action">

            <div class="mb-2">
                <label class="form-label">
                    Jumlah dikonfirmasi
                </label>

                <input
                    type="number"
                    class="form-control"
                    id="jumlahKonfirmasi_${item.rowNumber}"
                    min="1"
                    max="${item.jumlah}"
                    placeholder="Kosong = semua"
                >
            </div>

            <div class="d-flex gap-2">

                <button
                    class="btn btn-primary flex-fill"
                    onclick="konfirmasiPeminjaman(
                        ${item.rowNumber},
                        ${item.jumlah}
                    )"
                >
                    <i class="bi bi-check-lg"></i>
                    Konfirmasi
                </button>

                <button
                    class="btn btn-danger flex-fill"
                    onclick="tolakPeminjaman(${item.rowNumber})"
                >
                    <i class="bi bi-x-lg"></i>
                    Tidak Dikonfirmasi
                </button>

            </div>

        </div>
    `;

    daftarMenunggu.appendChild(card);

});


// ========================================
// DATA SEDANG DIPINJAM
// ========================================

dataDipinjam.forEach(function(item) {

    const card = document.createElement("div");

    card.className = "pinjam-card";

    card.innerHTML = `
        <div class="pinjam-card-content">

            <h4>${item.nama}</h4>

            <p>
                <strong>NIM:</strong>
                ${item.nim}
            </p>

            <p>
                <strong>Alat:</strong>
                ${item.namaAlat}
            </p>

            <p>
                <strong>Jumlah:</strong>
                ${item.jumlah}
            </p>

            <p>
                <strong>Keperluan:</strong>
                ${item.keperluan}
            </p>

            <p>
                <strong>Tanggal Pinjam:</strong>
                ${item.tanggalPinjam}
            </p>

        </div>

        <div class="pinjam-card-action">

            <div class="mb-2">
                <label class="form-label">
                    Jumlah kembali
                </label>

                <input
                    type="number"
                    class="form-control"
                    id="jumlahKembali_${item.rowNumber}"
                    min="1"
                    max="${item.jumlah}"
                    placeholder="Kosong = semua"
                >
            </div>

            <button
                class="btn btn-success w-100"
                onclick="kembalikanPeminjaman(
                    ${item.rowNumber},
                    ${item.jumlah}
                )"
            >
                <i class="bi bi-arrow-return-left"></i>
                Dikembalikan
            </button>

        </div>
    `;

    daftarDipinjam.appendChild(card);

});

}

// ========================================
// ROUTER UNTUK HALAMAN PINJAM ALAT
// ========================================

function cekHalamanPinjamAlat() {

if (location.hash === "#pinjam_alat") {

    setTimeout(function() {
        loadPinjamAlat();
    }, 100);

}

}

// Jalankan ketika berpindah halaman
window.addEventListener("hashchange", function() {

cekHalamanPinjamAlat();

});

// Jalankan ketika app.js pertama kali dimuat
cekHalamanPinjamAlat();

// ========================================
// KONFIRMASI PEMINJAMAN
// ========================================

function konfirmasiPeminjaman(rowNumber, jumlahMaksimal) {

    const input =
        document.getElementById("jumlahKonfirmasi_" + rowNumber);

    let jumlahKonfirmasi = input.value;

    // Jika kosong → konfirmasi semua
    if (jumlahKonfirmasi === "") {
        jumlahKonfirmasi = jumlahMaksimal;
    } else {
        jumlahKonfirmasi = Number(jumlahKonfirmasi);
    }

    // Validasi jumlah
    if (
        !Number.isInteger(jumlahKonfirmasi) ||
        jumlahKonfirmasi < 1 ||
        jumlahKonfirmasi > jumlahMaksimal
    ) {
        alert(
            "Jumlah dikonfirmasi harus antara 1 sampai " +
            jumlahMaksimal + "."
        );
        return;
    }
    
    tampilkanModalProses();


    fetch(URL_APPS_SCRIPT, {

        method: "POST",

        body: JSON.stringify({
            action: "konfirmasi",
            rowNumber: Number(rowNumber),
            jumlahKonfirmasi: jumlahKonfirmasi
        })

    })

    .then(response => response.json())

    .then(result => {

        if (!result.success) {
            throw new Error(result.message);
        }


        // Ambil data terbaru
        tampilkanModalSukses("Peminjaman sudah dikonfirmasi.");

        setTimeout(function() {

            tutupModalProses();

        }, 1500);
        loadPinjamAlat();

    })

    .catch(error => {

        console.error(error);

        alert("Gagal konfirmasi:\n" + error.message);

    });

}

function tolakPeminjaman(rowNumber) {

    tampilkanModalProses();

    fetch(URL_APPS_SCRIPT, {
        method: "POST",

        body: JSON.stringify({
            action: "tolak",
            rowNumber: Number(rowNumber)
        })
    })
    .then(response => response.json())
    .then(result => {

        console.log("Response Apps Script:", result);

        if (!result.success) {
            throw new Error(result.message);
        }

        tampilkanModalSukses(
            "Peminjaman tidak dikonfirmasi."
        );

        setTimeout(function() {

            tutupModalProses();

        }, 1200);

        loadPinjamAlat();

    })
    .catch(error => {

        console.error("ERROR:", error);

        tutupModalProses();

        alert(
            "Gagal memproses penolakan:\n" +
            error.message
        );

    });
}

function kembalikanPeminjaman(rowNumber, jumlahMaksimal) {

    const input =
        document.getElementById("jumlahKembali_" + rowNumber);

    let jumlahKembali = input.value;

    // Jika kosong → kembalikan semua
    if (jumlahKembali === "") {
        jumlahKembali = jumlahMaksimal;
    } else {
        jumlahKembali = Number(jumlahKembali);
    }

    // Validasi jumlah
    if (
        !Number.isInteger(jumlahKembali) ||
        jumlahKembali < 1 ||
        jumlahKembali > jumlahMaksimal
    ) {
        alert(
            "Jumlah kembali harus antara 1 sampai " +
            jumlahMaksimal + "."
        );
        return;
    }
    
    tampilkanModalProses();

    fetch(URL_APPS_SCRIPT, {
        method: "POST",
        body: JSON.stringify({
            action: "kembali",
            rowNumber: Number(rowNumber),
            jumlahKembali: jumlahKembali
        })
    })
    .then(response => response.json())
    .then(result => {

        console.log("Response Apps Script:", result);

        if (!result.success) {
            throw new Error(result.message);
        }

        tampilkanModalSukses("Alat sudah dikembalikan.");

        setTimeout(function() {

            tutupModalProses();

        }, 1500);
        loadPinjamAlat();

    })
    .catch(error => {

        console.error("ERROR:", error);

        alert("Gagal memproses pengembalian:\n" + error.message);

    });
}

function tampilkanModalProses() {

    const modalElement =
        document.getElementById("modalProses");

    const loading =
        document.getElementById("loadingProses");

    const sukses =
        document.getElementById("suksesProses");

    loading.style.display = "block";
    sukses.style.display = "none";

    const modal =
        bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.show();
}


function tampilkanModalSukses(pesan) {

    const loading =
        document.getElementById("loadingProses");

    const sukses =
        document.getElementById("suksesProses");

    const pesanSukses =
        document.getElementById("pesanSukses");

    loading.style.display = "none";

    sukses.style.display = "block";

    pesanSukses.textContent = pesan;
}


function tutupModalProses() {

    const modalElement =
        document.getElementById("modalProses");

    const modal =
        bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        modal.hide();
    }
}
// ===============================
// EVENT ROUTER
// ===============================

window.addEventListener("hashchange", router);

window.addEventListener("load", router);