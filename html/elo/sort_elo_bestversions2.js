const initialSort = { column: 2, ascending: false };
let currentSort = { column: -1, ascending: true };

function renderTable(sortedData) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return; // Sigurohu që ekziston
    tbody.innerHTML = '';
    sortedData.forEach((row, index) => {
        const tr = document.createElement('tr');
        if (index < 10) tr.classList.add('top-10');
        tr.innerHTML = `
            <td class="rank">${row[0]}</td>
            <td class="engine-name">${row[1]}</td>
            <td class="elo-rating">${row[2]}</td>
            <td>${row[3].toLocaleString()}</td>
            <td>${row[4]}</td>
        `;
        tbody.appendChild(tr);
    });
}

function sortData(column) {
    let isAscending;
    
    // LOGJIKA E TOGGLE
    if (currentSort.column === column) {
        isAscending = !currentSort.ascending;
    } else {
        isAscending = (column === initialSort.column) ? initialSort.ascending : true;
    }

    currentSort = { column, ascending: isAscending };

    // RENDITJA
    const sorted = [...data].sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        // Trajtimi i vlerave numerike (Elo, Games)
        if (!isNaN(valA) && !isNaN(valB)) {
            return isAscending ? parseFloat(valA) - parseFloat(valB) : parseFloat(valB) - parseFloat(valA);
        }
        
        // Trajtimi i tekstit (Emrat)
        valA = valA.toString();
        valB = valB.toString();
        return isAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    updateSortIndicators(column, isAscending);
    renderTable(sorted);
}

function updateSortIndicators(column, isAscending) {
    document.querySelectorAll('#bestversions th').forEach(th => {
        th.classList.remove('sorted-asc', 'sorted-desc');
    });
    const th = document.querySelector(`#bestversions th[data-column="${column}"]`);
    if (th) {
        th.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');
    }
}

document.querySelectorAll('#bestversions th.sortable').forEach(th => {
    th.addEventListener('click', () => sortData(parseInt(th.dataset.column)));
});

function toggleTheme() {
	document.body.classList.toggle('dark-mode');
	const btn = document.querySelector('.theme-toggle');
	if (document.body.classList.contains('dark-mode')) {
		btn.textContent = '☀️ Light Mode';
		localStorage.setItem('theme', 'dark');
	} else {
		btn.textContent = '🌙 Dark Mode';
		localStorage.setItem('theme', 'light');
	}
}

if (localStorage.getItem('theme') === 'dark') {
	document.body.classList.add('dark-mode');
	document.querySelector('.theme-toggle').textContent = '☀️ Light Mode';
}

// 2. HIQ DUPLIKATAT E EVENTEVE - Përdor vetëm një bllok
document.querySelectorAll('#bestversions th.sortable').forEach(th => {
    th.addEventListener('click', () => {
        const columnId = parseInt(th.dataset.column);
        sortData(columnId);
    });
});

// Inicializimi i parë
sortData(initialSort.column);
