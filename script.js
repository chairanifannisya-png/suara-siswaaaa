
const form = document.getElementById("reportForm");
const historyList = document.getElementById("historyList");
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

const STORAGE_KEY = "suaraSiswaReports";

function getReports() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

let reports = getReports();

// MENU NAVIGASI HP
menuToggle.addEventListener("click", function() {
    navigation.classList.toggle("active");
});

document.querySelectorAll("#navigation a").forEach(link => {
    link.addEventListener("click", function() {
        navigation.classList.remove("active");
    });
});

// SIMPAN DATA
function saveReports() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reports)
    );

    displayReports();
    updateStatistics();
}

// KIRIM LAPORAN
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const report = {
        id: Date.now(),
        nama: document.getElementById("nama").value.trim(),
        kelas: document.getElementById("kelas").value.trim(),
        jenis: document.getElementById("jenis").value,
        kategori: document.getElementById("kategori").value,
        judul: document.getElementById("judul").value.trim(),
        lokasi: document.getElementById("lokasi").value.trim(),
        isi: document.getElementById("isi").value.trim(),
        tanggal: new Date().toLocaleString("id-ID"),
        status: "Menunggu"
    };

    if (
        !report.nama ||
        !report.kelas ||
        !report.judul ||
        !report.isi
    ) {
        alert("Mohon lengkapi formulir!");
        return;
    }

    reports.unshift(report);

    saveReports();
    form.reset();

    document.getElementById("formMessage").textContent =
        "Laporan berhasil dikirim!";

    alert("Terima kasih! Laporan berhasil disimpan.");

    document.getElementById("riwayat").scrollIntoView({
        behavior: "smooth"
    });
});

// TAMPILKAN RIWAYAT
function displayReports() {
    historyList.innerHTML = "";

    if (reports.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <span>📭</span>
                <p>Belum ada laporan.</p>
            </div>
        `;
        return;
    }

    reports.forEach(report => {
        const item = document.createElement("div");
        item.className = "report-item";

        const title = document.createElement("h4");
        title.textContent = report.judul;
        item.appendChild(title);

        const details = [
            `Nama: ${report.nama} (${report.kelas})`,
            `Jenis: ${report.jenis}`,
            `Kategori: ${report.kategori}`,
            `Lokasi: ${report.lokasi || "-"}`,
            `Isi: ${report.isi}`,
            `Tanggal: ${report.tanggal}`
        ];

        details.forEach(detail => {
            const p = document.createElement("p");
            p.textContent = detail;
            item.appendChild(p);
        });

        const status = document.createElement("span");
        const currentStatus = report.status || "Menunggu";

        status.className =
            "status status-" + currentStatus.toLowerCase();

        status.textContent = "Status: " + currentStatus;

        item.appendChild(status);
        historyList.appendChild(item);
    });
}

// STATISTIK
function updateStatistics() {
    document.getElementById("totalLaporan").textContent =
        reports.length;

    document.getElementById("totalMenunggu").textContent =
        reports.filter(r =>
            (r.status || "Menunggu") === "Menunggu"
        ).length;

    document.getElementById("totalProses").textContent =
        reports.filter(r =>
            r.status === "Diproses"
        ).length;

    document.getElementById("totalSelesai").textContent =
        reports.filter(r =>
            r.status === "Selesai"
        ).length;
}

// JALANKAN SAAT WEBSITE DIBUKA
displayReports();
updateStatistics();
