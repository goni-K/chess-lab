
// Initial sort configuration
// column: which column to sort by initially (0=Rank, 1=Engine, 2=Score, etc.)
// ascending: true for ascending, false for descending
const initialSort = { column: 2, ascending: false };

// ============================================
// END CONFIGURATION SECTION
// ============================================

// Automatically highlight teams with top 3 positive delta values
let highlightedTeams = new Set();

function calculateHighlightedTeams() {
	const positiveDeltas = data
		.filter(row => row[5] > 0)
		.sort((a, b) => b[5] - a[5])
		.slice(0, 3);
	
	highlightedTeams = new Set(positiveDeltas.map(row => row[1]));
}

calculateHighlightedTeams();


// let currentSort = { ...initialSort };
let currentSort = { column: -1, ascending: true }; // Start with invalid column to force initial sort

function renderTable(sortedData) {
	const tbody = document.getElementById('tableBody');
	tbody.innerHTML = '';

	// Render all teams (all sortable in round-robin)
	sortedData.forEach((row, index) => {
		const tr = document.createElement('tr');
		if (highlightedTeams.has(row[1])) {
			tr.classList.add('top-3');
		}

		const deltaClass = row[5] > 0 ? 'positive' : 'negative';
		const deltaSign = row[5] > 0 ? '+' : '';
		const deltaFormatted = row[5] === 0 ? '0.0' : `${deltaSign}${row[5].toFixed(1)}`;

		tr.innerHTML = `
			<td class="rank">${row[0]}</td>
			<td class="team-name">${row[1]}</td>
			<td>${row[2].toFixed(1)}</td>
			<td>${row[3]}</td>
			<td class="elo-rating">${row[4].toFixed(1)}</td>
			<td><span class="delta ${deltaClass}">${deltaFormatted}</span></td>
			<td>${row[6].toFixed(1)}%</td>
		`;

		tbody.appendChild(tr);
	});
}

function sortData(column) {
	// Determine sort direction
	let isAscending;
	if (currentSort.column !== column) {
		// First time clicking this column - use initialSort if it matches, else default ascending
		isAscending = (column === initialSort.column) ? initialSort.ascending : true;
	} else {
		// Toggle current column
		isAscending = !currentSort.ascending;
	}
	currentSort = { column, ascending: isAscending };
	const sorted = [...data].sort((a, b) => {
		let valA = a[column];
		let valB = b[column];

		if (typeof valA === 'string' && typeof valB === 'string') {
			return isAscending 
				? valA.localeCompare(valB)
				: valB.localeCompare(valA);
		}

		const numA = parseFloat(valA);
		const numB = parseFloat(valB);

		return isAscending ? numA - numB : numB - numA;
	});

	updateSortIndicators(column, isAscending);
	renderTable(sorted);
}

function updateSortIndicators(column, isAscending) {
	document.querySelectorAll('th').forEach(th => {
		th.classList.remove('sorted-asc', 'sorted-desc');
	});

	const th = document.querySelector(`th[data-column="${column}"]`);
	th.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');
}

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

document.querySelectorAll('th.sortable').forEach(th => {
	th.addEventListener('click', () => {
		const column = parseInt(th.dataset.column);
		sortData(column);
	});
});

// Initial render - sort by Elo descending
sortData(initialSort.column);
