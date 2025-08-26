function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const sideMenu = document.querySelector('.side-menu');
    const overlay = document.querySelector('.overlay');
    
    hamburger.classList.toggle('active');
    sideMenu.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeMenu() {
    const hamburger = document.querySelector('.hamburger');
    const sideMenu = document.querySelector('.side-menu');
    const overlay = document.querySelector('.overlay');
    
    hamburger.classList.remove('active');
    sideMenu.classList.remove('active');
    overlay.classList.remove('active');
}

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    // Close menu
    closeMenu();
    
    // Reload Urban data when Urban page is selected
    if (pageId === 'urban') {
        const tbody = document.querySelector('#urbanTable tbody');
        tbody.innerHTML = '<tr><td colspan="5" class="loading">Memuat data...</td></tr>';
        
        loadCSVData().then(data => {
            populateUrbanTable(data);
        });
    }
}

// Function to load CSV data
async function loadCSVData() {
    try {
        const response = await fetch('urban.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            data.push(row);
        }
        
        return data;
    } catch (error) {
        console.error('Error loading CSV:', error);
        return [];
    }
}

// Function to populate table
function populateUrbanTable(data) {
    const tbody = document.querySelector('#urbanTable tbody');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">Data tidak dapat dimuat</td></tr>';
        return;
    }
    
    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        // Assuming CSV columns: nama_area, status, kapasitas, keterangan
        const statusClass = getStatusClass(row.status || row.Status);
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.nama_area || row['Nama Area'] || row.area || 'N/A'}</td>
            <td><span class="${statusClass}">${row.status || row.Status || 'N/A'}</span></td>
            <td>${row.kapasitas || row.Kapasitas || row.capacity || 'N/A'}</td>
            <td>${row.keterangan || row.Keterangan || row.description || 'N/A'}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Function to get status class
function getStatusClass(status) {
    if (!status) return '';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('aktif') || statusLower.includes('active') || statusLower.includes('online')) {
        return 'status-active';
    } else if (statusLower.includes('maintenance') || statusLower.includes('pemeliharaan')) {
        return 'status-maintenance';
    } else {
        return 'status-inactive';
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCSVData().then(data => {
        populateUrbanTable(data);
    });
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const sideMenu = document.querySelector('.side-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (!sideMenu.contains(event.target) && !hamburger.contains(event.target)) {
        closeMenu();
    }
});
