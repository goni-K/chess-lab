// Automatically highlight teams with top 3 positive delta values
// This is calculated automatically - no manual configuration needed
let highlightedTeams = new Set();

function calculateHighlightedTeams() {
	// Get teams with positive deltas and sort by delta descending
	const positiveDeltas = data
		.filter(row => row[5] > 0)
		.sort((a, b) => b[5] - a[5])
		.slice(0, 10);
	
	const mainDeltaClass = mainTeam[5] > 0 ? 'positive' : mainTeam[5] < 0 ? 'negative' : '';
	const mainDeltaSign = mainTeam[5] > 0 ? '+' : '';
	
	highlightedTeams = new Set(positiveDeltas.map(row => row[1]));
}

// Calculate which teams to highlight on load
calculateHighlightedTeams();

// Initial sort configuration
// column: which column to sort by initially (0=Rank, 1=Team, 2=Col-3, etc.)
// ascending: true for ascending, false for descending
const initialSort = { column: 3, ascending: false };

// ============================================
// END CONFIGURATION SECTION
// ============================================

let currentSort = { ...initialSort };

function renderTable(sortedData) {
	const tbody = document.getElementById('tableBody');
	tbody.innerHTML = '';

	// Always render main team first
	const mainTr = document.createElement('tr');
	mainTr.classList.add('main-team');
	
	const mainDeltaClass = mainTeam[5] > 0 ? 'positive' : mainTeam[5] < 0 ? 'negative' : '';
	const mainDeltaSign = mainTeam[5] > 0 ? '+' : mainTeam[5] < 0 ? '' : '';
	const mainDeltaFormatted = mainTeam[5] === 0 ? '0.0' : `${mainDeltaSign}${mainTeam[5].toFixed(1)}`;

	mainTr.innerHTML = `
		<td class="rank">${mainTeam[0]}</td>
		<td class="team-name">${mainTeam[1]}</td>
		<td>${mainTeam[2].toFixed(1)}</td>
		<td>${mainTeam[3]}</td>
		<td class="elo-rating">${mainTeam[4].toFixed(1)}</td>
		<td><span class="delta ${mainDeltaClass}">${mainDeltaFormatted}</span></td>
		<td>${mainTeam[6].toFixed(1)}%</td>
	`;
	tbody.appendChild(mainTr);

	// Render sorted opponent teams
	sortedData.forEach((row, index) => {
		const tr = document.createElement('tr');
		// Apply top-3 styling to specific teams regardless of position
		if (highlightedTeams.has(row[1])) {
			tr.classList.add('top-3');
		}

		const deltaClass = row[5] > 0 ? 'positive' : 'negative';
		const deltaSign = row[5] > 0 ? '+' : '';
		// const deltaFormatted = row[5] === 0 ? '0.0' : `${deltaSign}${Math.abs(row[5]).toFixed(1)}`;
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
	const isAscending = currentSort.column === column ? !currentSort.ascending : currentSort.ascending; // copilot
	currentSort = { column, ascending: isAscending };

	const sorted = [...data].sort((a, b) => {
		let valA = a[column];
		let valB = b[column];

		// Check if it's a string (team names)
		if (typeof valA === 'string' && typeof valB === 'string') {
			return isAscending 
				? valA.localeCompare(valB)
				: valB.localeCompare(valA);
		}

		// Convert to numbers for numeric comparison
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

// Load saved theme preference
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

// Initial render with configured sort
sortData(2);

function goBackToOverview() {
	// Kjo i thotë dritares prind: "Hiqe këtë m*t që ke hapur në iframe"
	if (window.parent) {
		window.parent.document.getElementById('content-frame').src = 'about:blank';
	}
}
