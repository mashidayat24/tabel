// Toggle menu hamburger
document.getElementById('menu-toggle').addEventListener('click', function() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('show');
});

// Hide menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('menu');
    const menuToggle = document.getElementById('menu-toggle');
    
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menu.classList.remove('show');
    }
});

// Show page function
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Hide menu
    document.getElementById('menu').classList.remove('show');
    
    // Load data based on page
    switch(pageId) {
        case 'urban':
            loadCSVData('urban', 'urban.csv');
            break;
        case 'mandorline':
            loadCSVData('mandorline', 'mandorline.csv');
            break;
        case 'pemadaman':
            loadCSVData('pemadaman', 'pemadaman.csv');
            break;
        case 'ct-manual':
            // Initialize CT Manual page
            updatePreview();
            break;
    }
}

// Generic function to load CSV data
function loadCSVData(pageType, csvFile) {
    const loading = document.getElementById(`${pageType}-loading`);
    const table = document.getElementById(`${pageType}-table`);
    
    loading.style.display = 'block';
    table.style.display = 'none';
    
    // Fetch CSV file
    fetch(csvFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            parseCSVAndCreateTable(csvText, pageType);
            loading.style.display = 'none';
            table.style.display = 'table';
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
            loading.innerHTML = `Error memuat data ${pageType}. Pastikan file ${csvFile} tersedia.`;
            
            // Show sample data if CSV file is not available
            createSampleTable(pageType);
            table.style.display = 'table';
        });
}

// Parse CSV and create table
function parseCSVAndCreateTable(csvText, pageType) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    // Create table header
    const headerRow = document.getElementById(`${pageType}-table-header`);
    headerRow.innerHTML = '';
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.trim().replace(/"/g, '');
        headerRow.appendChild(th);
    });
    
    // Create table body
    const tbody = document.getElementById(`${pageType}-table-body`);
    tbody.innerHTML = '';
    
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        const tr = document.createElement('tr');
        
        row.forEach((cell, index) => {
            const td = document.createElement('td');
            td.textContent = cell.trim().replace(/"/g, '');
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    }
}

// Create sample table if CSV is not available
function createSampleTable(pageType) {
    const loading = document.getElementById(`${pageType}-loading`);
    loading.innerHTML = `File ${pageType}.csv tidak ditemukan. Menampilkan data contoh:`;
    
    // Sample data based on page type
    let sampleData = [];
    
    switch(pageType) {
        case 'urban':
            sampleData = [
                ['No', 'Nama Lokasi', 'Status', 'Prioritas', 'Keterangan'],
                ['1', 'Jalan Sudirman', 'Aktif', 'Tinggi', 'Patroli rutin'],
                ['2', 'Jalan Thamrin', 'Maintenance', 'Sedang', 'Perbaikan kabel'],
                ['3', 'Jalan Gatot Subroto', 'Aktif', 'Tinggi', 'Monitoring 24 jam'],
                ['4', 'Jalan Kuningan', 'Pending', 'Rendah', 'Menunggu approval'],
                ['5', 'Jalan Senayan', 'Aktif', 'Sedang', 'Patroli berkala']
            ];
            break;
        case 'mandorline':
            sampleData = [
                ['No', 'Nama Mandor', 'Area', 'Shift', 'Status'],
                ['1', 'Ahmad Suryadi', 'Area A', 'Pagi', 'Aktif'],
                ['2', 'Budi Santoso', 'Area B', 'Siang', 'Aktif'],
                ['3', 'Candra Wijaya', 'Area C', 'Malam', 'Cuti'],
                ['4', 'Dedi Kurniawan', 'Area D', 'Pagi', 'Aktif'],
                ['5', 'Eko Prasetyo', 'Area E', 'Siang', 'Aktif']
            ];
            break;
        case 'pemadaman':
            sampleData = [
                ['No', 'Lokasi', 'Waktu Mulai', 'Waktu Selesai', 'Status'],
                ['1', 'Blok A1-A5', '08:00', '12:00', 'Selesai'],
                ['2', 'Blok B1-B3', '13:00', '17:00', 'Berlangsung'],
                ['3', 'Blok C1-C7', '09:00', '15:00', 'Dijadwalkan'],
                ['4', 'Blok D1-D4', '14:00', '18:00', 'Selesai'],
                ['5', 'Blok E1-E6', '10:00', '16:00', 'Berlangsung']
            ];
            break;
    }
    
    // Create header
    const headerRow = document.getElementById(`${pageType}-table-header`);
    headerRow.innerHTML = '';
    sampleData[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    // Create body
    const tbody = document.getElementById(`${pageType}-table-body`);
    tbody.innerHTML = '';
    
    for (let i = 1; i < sampleData.length; i++) {
        const tr = document.createElement('tr');
        sampleData[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }
}

// KCT Functions
function openKCT() {
    window.open('https://pdpjpwt.my.id/', '_blank');
    // Hide menu after opening
    document.getElementById('menu').classList.remove('show');
}

// VKRN Functions
function openVKRN() {
    window.open('https://tewbo.my.id/', '_blank');
    // Hide menu after opening
    document.getElementById('menu').classList.remove('show');
}

// CT Dengan Gambar Functions
let uploadedImage = null;

// Initialize drag and drop
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');
    
    if (uploadArea && imageInput) {
        // Drag and drop events
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageUpload(files[0]);
            }
        });
        
        // File input change
        imageInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleImageUpload(e.target.files[0]);
            }
        });
    }
    
    // Initialize CT Manual page
    updatePreview();
});

function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('Mohon pilih file gambar yang valid!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImage = e.target.result;
        
        // Show preview
        document.getElementById('preview-image').src = uploadedImage;
        document.getElementById('preview-section').style.display = 'block';
        
        // Hide other sections
        document.getElementById('loading-section').style.display = 'none';
        document.getElementById('result-section').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function processImage() {
    if (!uploadedImage) {
        alert('Mohon upload gambar terlebih dahulu!');
        return;
    }
    
    // Show loading
    document.getElementById('loading-section').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';
    
    // Process with Tesseract.js
    Tesseract.recognize(
        uploadedImage,
        'eng',
        {
            logger: m => {
                if (m.status === 'recognizing text') {
                    const progress = Math.round(m.progress * 100);
                    document.getElementById('progress-fill').style.width = progress + '%';
                    document.getElementById('progress-text').textContent = progress + '%';
                }
            }
        }
    ).then(({ data: { text } }) => {
        // Extract data
        const meterNumber = extractMeterNumber(text);
        const gNumber = extractGNumber(text);
        
        // Show results
        document.getElementById('meter-number').value = meterNumber;
        document.getElementById('g-number').value = gNumber;
        document.getElementById('full-text').value = text;
        
        // Hide loading and show results
        document.getElementById('loading-section').style.display = 'none';
        document.getElementById('result-section').style.display = 'block';
        
    }).catch(err => {
        console.error('OCR Error:', err);
        alert('Terjadi kesalahan saat memproses gambar. Silakan coba lagi.');
        document.getElementById('loading-section').style.display = 'none';
    });
}

function extractMeterNumber(text) {
    // Look for numbers starting with 52205
    const meterRegex = /52205\d+/g;
    const matches = text.match(meterRegex);
    return matches ? matches[0] : '';
}

function extractGNumber(text) {
    // Look for G followed by numbers
    const gRegex = /G\d+/gi;
    const matches = text.match(gRegex);
    return matches ? matches[0] : '';
}

function enableEdit() {
    document.getElementById('meter-number').readOnly = false;
    document.getElementById('g-number').readOnly = false;
    document.getElementById('full-text').readOnly = false;
    
    // Change button text
    const editBtn = document.querySelector('.edit-btn');
    editBtn.innerHTML = '<span class="edit-icon">💾</span>Simpan';
    editBtn.onclick = saveEdit;
}

function saveEdit() {
    document.getElementById('meter-number').readOnly = true;
    document.getElementById('g-number').readOnly = true;
    document.getElementById('full-text').readOnly = true;
    
    // Change button text back
    const editBtn = document.querySelector('.edit-btn');
    editBtn.innerHTML = '<span class="edit-icon">✏️</span>Edit Data';
    editBtn.onclick = enableEdit;
    
    alert('Data berhasil disimpan!');
}

function sendToWhatsApp() {
    const meterNumber = document.getElementById('meter-number').value.trim();
    const gNumber = document.getElementById('g-number').value.trim();
    
    if (!meterNumber || !gNumber) {
        alert('Mohon pastikan nomor meter dan nomor G telah terisi!');
        return;
    }
    
    const message = `*FORMAT PERMINTAAN CLEAR TEMPER*
ID Pelanggan/Nomor Meter : ${meterNumber}
Nomor gangguan/PK : ${gNumber}
Keterangan: kwh meter periksa.`;
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
}

function resetForm() {
    if (confirm('Apakah Anda yakin ingin mereset semua data?')) {
        // Reset all sections
        document.getElementById('preview-section').style.display = 'none';
        document.getElementById('loading-section').style.display = 'none';
        document.getElementById('result-section').style.display = 'none';
        
        // Clear inputs
        document.getElementById('image-input').value = '';
        document.getElementById('meter-number').value = '';
        document.getElementById('g-number').value = '';
        document.getElementById('full-text').value = '';
        
        // Reset uploaded image
        uploadedImage = null;
    }
}

// CT Manual Functions
function updatePreview() {
    const meterNumberInput = document.getElementById('manual-meter-number');
    const gNumberInput = document.getElementById('manual-g-number');
    const previewText = document.getElementById('manual-preview-text');
    const sendButton = document.querySelector('.whatsapp-btn-manual');
    
    if (!meterNumberInput || !gNumberInput || !previewText) {
        return; // Elements not found, probably not on CT Manual page
    }
    
    const meterNumber = meterNumberInput.value.trim();
    const gNumber = gNumberInput.value.trim();
    
    const message = `*FORMAT PERMINTAAN CLEAR TEMPER*
ID Pelanggan/Nomor Meter : ${meterNumber}
Nomor gangguan/PK : ${gNumber}
Keterangan: kwh meter periksa.`;
    
    previewText.textContent = message;
    
    // Enable/disable button based on input
    if (sendButton) {
        if (meterNumber && gNumber) {
            sendButton.disabled = false;
            sendButton.style.opacity = '1';
        } else {
            sendButton.disabled = true;
            sendButton.style.opacity = '0.6';
        }
    }
}

function sendManualToWhatsApp() {
    const meterNumber = document.getElementById('manual-meter-number').value.trim();
    const gNumber = document.getElementById('manual-
