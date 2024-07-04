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

    let cveRecords = [{ cveId: 'CVE-2021-32628', severity: 'High', cvss: 7.5, affectedPackages: 'redis-server, redis-tools', cweId: 'CWE-190' },
        { cveId: 'CVE-2016-1585', severity: 'Critical', cvss: 9.8, affectedPackages: 'apparmor, libapparmor1', cweId: 'CWE-254' },
        { cveId: 'CVE-2021-20308', severity: 'Critical', cvss: 9.8, affectedPackages: 'htmldoc, htmldoc-common', cweId: 'CWE-190' },
        { cveId: 'CVE-2021-4048', severity: 'Critical', cvss: 9.8, affectedPackages: 'libblas3', cweId: 'CWE-125' },
        { cveId: 'CVE-2022-36227', severity: 'Critical', cvss: 9.8, affectedPackages: 'libarchive13', cweId: 'CWE-476' },
        { cveId: 'CVE-2021-3697', severity: 'High', cvss: 7, affectedPackages: 'grub-common, grub-pc, grub-pc-bin, grub2-common', cweId: 'CWE-787' },
        { cveId: 'CVE-2021-38091', severity: 'High', cvss: 8.8, affectedPackages: 'libavcodec58, libavutil56, libswresample3', cweId: 'CWE-190' },
        { cveId: 'CVE-2016-2781', severity: 'Medium', cvss: 6.5, affectedPackages: 'coreutils', cweId: 'CWE-20' },
        { cveId: 'CVE-2016-9802', severity: 'Medium', cvss: 5.3, affectedPackages: 'bluez, libbluetooth3', cweId: 'CWE-119' },
        { cveId: 'CVE-2019-1563', severity: 'Low', cvss: 3.7, affectedPackages: 'libnode72', cweId: 'CWE-327' }
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
