// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    const cveTableBody = document.getElementById('cveTableBody');
    const addCveBtn = document.getElementById('addCveBtn');
    const cveModal = document.getElementById('cveModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const cveForm = document.getElementById('cveForm');
    const modalTitle = document.getElementById('modalTitle');
    const filterInput = document.getElementById('filterInput');

    let cveRecords = [
        { cveId: 'CVE-2021-34527', severity: 'High', cvss: 9.8, affectedPackages: 'Windows', cweId: 'CWE-94' },
        { cveId: 'CVE-2020-1472', severity: 'Critical', cvss: 10.0, affectedPackages: 'Netlogon', cweId: 'CWE-269' },
        // Add more CVE records here
    ];

    let isEditing = false;
    let editIndex = -1;
    let currentSort = { column: null, order: 'asc' };

    function renderTable(records = cveRecords) {
        cveTableBody.innerHTML = '';
        records.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.cveId}</td>
                <td>${record.severity}</td>
                <td>${record.cvss}</td>
                <td>${record.affectedPackages}</td>
                <td>${record.cweId}</td>
                <td class="actions">
                    <button class="edit" onclick="editRecord(${index})">Edit</button>
                    <button class="delete" onclick="deleteRecord(${index})">Delete</button>
                </td>
            `;
            cveTableBody.appendChild(row);
        });
    }

    function sortTable(column) {
        const sortedRecords = [...cveRecords];
        const order = currentSort.column === column && currentSort.order === 'asc' ? 'desc' : 'asc';
        sortedRecords.sort((a, b) => {
            if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
            if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
            return 0;
        });
        currentSort = { column, order };
        renderTable(sortedRecords);
    }

    function filterRecords() {
        const query = filterInput.value.toLowerCase();
        const filteredRecords = cveRecords.filter(record => 
            Object.values(record).some(value => 
                value.toString().toLowerCase().includes(query)
            )
        );
        renderTable(filteredRecords);
    }

    addCveBtn.onclick = function() {
        isEditing = false;
        modalTitle.textContent = 'Add CVE';
        cveForm.reset();
        cveModal.style.display = 'block';
    };

    closeBtn.onclick = function() {
        cveModal.style.display = 'none';
    };

    cancelBtn.onclick = function() {
        cveModal.style.display = 'none';
    };

    cveForm.onsubmit = function(event) {
        event.preventDefault();

        const newRecord = {
            cveId: cveForm.cveId.value,
            severity: cveForm.severity.value,
            cvss: parseFloat(cveForm.cvss.value),
            affectedPackages: cveForm.affectedPackages.value,
            cweId: cveForm.cweId.value,
        };

        if (isEditing) {
            cveRecords[editIndex] = newRecord;
        } else {
            cveRecords.push(newRecord);
        }

        renderTable();
        cveModal.style.display = 'none';
    };

    window.editRecord = function(index) {
        isEditing = true;
        editIndex = index;
        modalTitle.textContent = 'Edit CVE';
        const record = cveRecords[index];

        cveForm.cveId.value = record.cveId;
        cveForm.severity.value = record.severity;
        cveForm.cvss.value = record.cvss;
        cveForm.affectedPackages.value = record.affectedPackages;
        cveForm.cweId.value = record.cweId;

        cveModal.style.display = 'block';
    };

    window.deleteRecord = function(index) {
        if (confirm('Are you sure you want to delete this record?')) {
            cveRecords.splice(index, 1);
            renderTable();
        }
    };

    filterInput.onkeyup = filterRecords;
    window.sortTable = sortTable;
    renderTable();
});