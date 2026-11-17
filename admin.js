
const ADMIN_PASSWORD = "admin123";
const STORAGE_KEY = "suaraSiswaReports";

const loginForm = document.getElementById("loginForm");
const loginAdmin = document.getElementById("loginAdmin");
const dashboardAdmin = document.getElementById("dashboardAdmin");
const adminHistoryList = document.getElementById("adminHistoryList");

// AMBIL DATA
function getReports() {
    try {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );
    } catch {
        return [];
    }
}

let reports = getReports();

// LOGIN ADMIN
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const password =
        document.getElementById("passwordAdmin").value;

    if (password === ADMIN_PASSWORD) {

        sessionStorage.setItem("adminLogin", "true");

        showDashboard();

    } else {

        const message =
            document.getElementById("loginMessage");

        message.textContent =
            "Password salah! Silakan coba lagi.";

        message.style.color = "red";
    }
});

// TAMPILKAN DASHBOARD
function showDashboard() {
    loginAdmin.hidden = true;
    dashboardAdmin.hidden = false;

    loadReports();
}

// CEK STATUS LOGIN
if (sessionStorage.getItem("adminLogin") === "true") {
    showDashboard();
}

// MEMUAT DATA LAPORAN
function loadReports() {
    reports = getReports();

    displayAdminReports();
    updateAdminStatistics();
}

// SIMPAN DATA
function saveAdminReports() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reports)
    );

    loadReports();
}

// TAMPILKAN SEMUA LAPORAN
function displayAdminReports() {
    adminHistoryList.innerHTML = "";

    if (reports.length === 0) {
        adminHistoryList.innerHTML = `
            <div class="empty-state">
                <span>📭</span>
                <p>Belum ada laporan dari siswa.</p>
            </div>
        `;
        return;
    }

    reports.forEach(report => {

        const item = document.createElement("div");
        item.className = "report-item admin-report";

        // JUDUL
        const title = document.createElement("h3");
        title.textContent = report.judul;
        item.appendChild(title);

        // DETAIL LAPORAN
        const details = [
            `Nama: ${report.nama}`,
            `Kelas: ${report.kelas}`,
            `Jenis: ${report.jenis}`,
            `Kategori: ${report.kategori}`,
            `Lokasi: ${report.lokasi || "-"}`,
            `Isi laporan: ${report.isi}`,
            `Tanggal: ${report.tanggal}`
        ];

        details.forEach(detail => {
            const p = document.createElement("p");
            p.textContent = detail;
            item.appendChild(p);
        });

        // LABEL STATUS
        const label = document.createElement("label");

        label.className = "admin-status-label";
        label.textContent = "Ubah Status Laporan:";

        item.appendChild(label);

        // PILIHAN STATUS
        const select = document.createElement("select");
        select.className = "status-select";

        const pilihanStatus = [
            "Menunggu",
            "Diproses",
            "Selesai"
        ];

        pilihanStatus.forEach(status => {

            const option = document.createElement("option");

            option.value = status;
            option.textContent = status;

            if ((report.status || "Menunggu") === status) {
                option.selected = true;
            }

            select.appendChild(option);
        });

        // SIMPAN PERUBAHAN STATUS
        select.addEventListener("change", function() {

            report.status = this.value;

            saveAdminReports();

            alert("Status laporan berhasil diperbarui!");

        });

        item.appendChild(select);

        // TOMBOL HAPUS SATU LAPORAN
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-one";
        deleteButton.textContent = "🗑 Hapus Laporan";

        deleteButton.addEventListener("click", function() {

            const konfirmasi = confirm(
                "Apakah kamu yakin ingin menghapus laporan ini?"
            );

            if (konfirmasi) {

                reports = reports.filter(r => r.id !== report.id);

                saveAdminReports();

                alert("Laporan berhasil dihapus!");

            }
        });

        item.appendChild(deleteButton);

        adminHistoryList.appendChild(item);

    });
}

// STATISTIK ADMIN
function updateAdminStatistics() {

    document.getElementById("adminTotal").textContent =
        reports.length;

    document.getElementById("adminMenunggu").textContent =
        reports.filter(r =>
            (r.status || "Menunggu") === "Menunggu"
        ).length;

    document.getElementById("adminProses").textContent =
        reports.filter(r =>
            r.status === "Diproses"
        ).length;

    document.getElementById("adminSelesai").textContent =
        reports.filter(r =>
            r.status === "Selesai"
        ).length;
}

// HAPUS SEMUA LAPORAN
document.getElementById("deleteAll").addEventListener("click", function() {

    if (reports.length === 0) {
        alert("Belum ada laporan yang bisa dihapus.");
        return;
    }

    const konfirmasi = confirm(
        "PERINGATAN!\nApakah kamu yakin ingin menghapus SEMUA laporan siswa?"
    );

    if (konfirmasi) {

        reports = [];

        saveAdminReports();

        alert("Semua laporan berhasil dihapus!");

    }
});

// LOGOUT ADMIN
document.getElementById("logoutAdmin").addEventListener("click", function() {

    sessionStorage.removeItem("adminLogin");

    location.reload();

});
