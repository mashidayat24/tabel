document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const tableContainer = document.getElementById('table-container');

    // Load CSV files in the same directory
    const csvFiles = ['urban.csv']; // Ganti dengan nama file CSV Anda

    csvFiles.forEach(file => {
        const li = document.createElement('li');
        li.innerText = file;
        li.onclick = () => loadCSV(file);
        navbar.appendChild(li);
    });

    function loadCSV(file) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(','));
                displayTable(rows);
            });
    }

    function displayTable(rows) {
        let tableHTML = '<table>';
        rows.forEach((row, index) => {
            tableHTML += '<tr>';
            row.forEach(cell => {
                tableHTML += `<td>${cell.trim()}</td>`;
            });
            tableHTML += '</tr>';
        });
        tableHTML += '</table>';
        tableContainer.innerHTML = tableHTML;
    }

    // Admin login functionality
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'admin' && password === 'Kejajar@52205') {
                document.getElementById('admin-container').style.display = 'block';
                loadCSV('urban.csv'); // Load CSV for editing
            } else {
                alert('Username atau password salah!');
            }
        });
    }

    // Save CSV functionality
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            const csvContent = document.getElementById('csv-content').value;
            // Simpan CSV ke server (implementasi server-side diperlukan)
            alert('CSV disimpan!'); // Placeholder
        });
    }
});
