document.addEventListener('click', function(e) {
    const folder = e.target.closest('.folder');
    if (!folder) return;

    const nested = folder.nextElementSibling;
    if (nested && nested.classList.contains('nested')) {
        const id = folder.innerText.trim();
        
        // Toggle Display
        if (nested.style.display === 'block') {
            nested.style.display = 'none';
            localStorage.removeItem('f_' + id);
        } else {
            nested.style.display = 'block';
            localStorage.setItem('f_' + id, 'active');
        }
    }
});

window.addEventListener('load', function() {
    document.querySelectorAll('.folder').forEach(folder => {
        const id = folder.innerText.trim();
        const nested = folder.nextElementSibling;

        if (nested && nested.classList.contains('nested')) {
            if (localStorage.getItem('f_' + id) === 'active') {
                nested.style.display = 'block';
            } else {
                nested.style.display = 'none';
            }
        }
    });
});

function openFile(url, element) {
    const frame = document.getElementById('content-frame');
    if (!frame) return;

    // Remove active state from all links
    document.querySelectorAll('.nested a').forEach(a => {
        a.classList.remove('active-link');
    });

    // Mark current selection
    if (element) {
        element.classList.add('active-link');
    }

    const urlParts = url.split('#');
    const newFile = urlParts[0];
    const hash = urlParts[1];

    // Read: Logic to prevent unnecessary reloads
    const currentSrc = decodeURIComponent(frame.src);
    
    if (currentSrc.includes(newFile) && hash) {
        try {
            // Think: Jump to specific game/result if file is already loaded
            const elementToScroll = frame.contentDocument.getElementById(hash);
            if (elementToScroll) {
                elementToScroll.scrollIntoView({ behavior: 'smooth' });
            } else {
                frame.src = url;
            }
        } catch(e) {
            // Check: Fallback for cross-origin or loading issues
            frame.src = url;
        }
    } else {
        // Go: Hard load for new files
        frame.src = url;
    }
}

document.getElementById('search').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let keyword = this.value.toLowerCase().trim();
        let allLinks = document.querySelectorAll('a[onclick*="openFile"]');
        let found = false;

        for (let link of allLinks) {
            let linkText = link.innerText.toLowerCase();
            if (linkText.includes(keyword)) {
                link.click(); 
                found = true;
                break;
            }
        }

        if (!found) {
            alert("O Mjeshtër, '" + keyword + "' nuk ekziston as te divizionet, as te motorët!");
        }
    }
});
const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('search-results');

searchInput.addEventListener('input', function() {
    let keyword = this.value.toLowerCase().trim();
    resultsDiv.innerHTML = ''; 
    
    if (keyword.length < 1) return; 

    let allLinks = document.querySelectorAll('a[onclick*="openFile"]');
    
    allLinks.forEach(link => {
        let text = link.innerText;
        if (text.toLowerCase().includes(keyword)) {
            let item = document.createElement('div');
            item.style = "padding:8px; cursor:pointer; border-bottom:1px solid #30363d; color:white;";
            item.innerText = text;
            item.onclick = () => {
                link.click();
                resultsDiv.innerHTML = '';
                searchInput.value = text;
            };
            resultsDiv.appendChild(item);
        }
    });
});

function viewEloList() {
    console.log("Butoni u shtyp! Funksioni u gjet!");
    
    fetch("ELO-UltraBullet.txt") 
        .then(response => response.text())
        .then(data => {
            const displayBox = document.getElementById('list-display');
            displayBox.innerHTML = '<h3>Lista u Shfaq</h3><pre>' + data + '</pre>';
        })
        .catch(error => {
            document.getElementById('list-display').innerHTML = '<p style="color: red;">Gabim gjatë Fetch: Skedari nuk u gjet.</p>';
        });
}
