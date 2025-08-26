const mobileMenu = document.getElementById('mobile-menu');
const nav = document.getElementById('nav-menu');
let currentZoom = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

// Toggle menu hamburger
mobileMenu.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Tutup menu ketika mengklik di luar menu
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        nav.classList.remove('active');
    }
});

// Fungsi untuk menampilkan section
function showSection(sectionId) {
    // Sembunyikan semua section
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Tampilkan section yang dipilih
    document.getElementById(sectionId).classList.add('active');
    
    // Tutup menu
    nav.classList.remove('active');
}

// Fungsi untuk membuka modal zoom
function openModal(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    modal.style.display = 'block';
    modalImg.src = img.src;
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
}

// Fungsi untuk menutup modal
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Fungsi zoom in
function zoomIn() {
    currentZoom += 0.2;
    if (currentZoom > 3) currentZoom = 3;
    updateImageTransform();
}

// Fungsi zoom out
function zoomOut() {
    currentZoom -= 0.2;
    if (currentZoom < 0.5) currentZoom = 0.5;
    updateImageTransform();
}

// Fungsi reset zoom
function resetZoom() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
}

// Update transform gambar
function updateImageTransform() {
    const modalImg = document.getElementById('modalImage');
    modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
}

// Event listener untuk drag gambar di modal
document.getElementById('modalImage').addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);

// Touch events untuk mobile
document.getElementById('modalImage').addEventListener('touchstart', startDragTouch);
document.addEventListener('touchmove', dragTouch);
document.addEventListener('touchend', endDrag);

function startDrag(e) {
    if (currentZoom > 1) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    }
}

function startDragTouch(e) {
    if (currentZoom > 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
    }
}

function drag(e) {
    if (isDragging && currentZoom > 1) {
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateImageTransform();
    }
}

function dragTouch(e) {
    if (isDragging && currentZoom > 1) {
        e.preventDefault();
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateImageTransform();
    }
}

function endDrag() {
    isDragging = false;
}

// Tutup modal dengan ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Zoom dengan scroll wheel
document.getElementById('modalImage').addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        zoomIn();
    } else {
        zoomOut();
    }
});
// JavaScript sebelumnya tetap sama, tambahkan yang berikut:

let csvData = [];
let filteredData = [];

// Load CSV data when Urban section is shown
function showSection(sectionId) {
    // Sembunyikan semua section
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Tampilkan section yang dipilih
    document.getElementById(sectionId).classList.add('active');
    
    // Load CSV data jika section Urban
    if (sectionId === 'urban') {
        loadCSVData();
    }
    
    // Tutup menu
    nav.classList.remove('active');
}

// Function to load CSV data
async function loadCSVData() {
    try {
        const response = await fetch('urban.csv');
        if (!response.ok) {
            throw new Error('File urban.csv tidak ditemukan');
        }
        
        const csvText = await response.text();
        csvData = parseCSV(csvText);
        filteredData = [...csvData];
        displayTable(filteredData);
        updateTableInfo();
        
    } catch (error) {
        console.error('Error loading CSV:', error);
        document.getElementById('tableBody').innerHTML = `
            <tr>
                <td colspan="100%" class="error">
                    Error: ${error.message}<br>
                    Pastikan file urban.csv tersedia di direktori yang sama.
                </td>
            </tr>
        `;
    }
}

// Function to parse CSV
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            data.push(row);
        }
    }
    
    return { headers, data };
}

// Function to parse CSV line (handles commas in quotes)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Function to display table
function displayTable(data) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    
    if (!data.headers || !data.data) {
        tableBody.innerHTML = '<tr><td colspan="100%" class="error">Data tidak valid</td></tr>';
        return;
    }
    
    // Create header
    tableHeader.innerHTML = '';
    data.headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });
    
    // Create body
    tableBody.innerHTML = '';
    if (data.data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="100%" style="text-align: center; padding: 40px; color: #666;">Tidak ada data yang ditemukan</td></tr>';
        return;
    }
    
    data.data.forEach((row, index) => {
        const tr = document.createElement('tr');
        data.headers
