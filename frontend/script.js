// ================================
// MAP INIT
// ================================
var map = L.map('map', {
  zoomControl: false
}).setView([20.5937, 78.9629], 5)

// Custom zoom control position
L.control.zoom({ position: 'bottomright' }).addTo(map)

// Dark map tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap © CARTO'
}).addTo(map)

let selectedLat = null
let selectedLng = null
let allProblems = []  // sare problems store karo filtering ke liye
let currentFilter = 'all'

// ================================
// ICONS
// ================================
function makeIcon(color) {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  })
}

var icons = {
  "Road Damage":    makeIcon('red'),
  "Garbage":        makeIcon('yellow'),
  "Water Leakage":  makeIcon('green'),
  "Street Light":   makeIcon('blue'),
  "default":        makeIcon('red')
}

function getIcon(category) {
  return icons[category] || icons["default"]
}

// ================================
// POPUP HTML
// ================================
function getEmoji(category) {
  const map = {
    "Road Damage":   "🛣️",
    "Garbage":       "🗑️",
    "Water Leakage": "💧",
    "Street Light":  "💡"
  }
  return map[category] || "📍"
}

function makePopup(data) {
  return `
    <div class="popup-name">${getEmoji(data.category)} ${data.name}</div>
    <div class="popup-cat">${data.category}</div>
    <div class="popup-desc">${data.description || 'No description'}</div>
    <span class="popup-status ${data.status === 'resolved' ? 'resolved' : ''}">${data.status || 'pending'}</span>
  `
}

// ================================
// ADD MARKER TO MAP
// ================================
function addMarker(data) {
  return L.marker([data.lat, data.lng], { icon: getIcon(data.category) })
    .addTo(map)
    .bindPopup(makePopup(data))
}

// ================================
// SIDEBAR — ISSUE CARD
// ================================
function makeIssueCard(data) {
  const card = document.createElement('div')
  card.className = 'issue-card'
  card.dataset.category = data.category
  card.innerHTML = `
    <div class="issue-card-top">
      <span class="issue-emoji">${getEmoji(data.category)}</span>
      <div class="issue-info">
        <div class="issue-name">${data.name}</div>
        <div class="issue-cat">${data.category}</div>
      </div>
      <span class="issue-status ${data.status === 'resolved' ? 'resolved' : ''}">${data.status || 'pending'}</span>
    </div>
    <div class="issue-desc">${data.description || 'No description provided'}</div>
  `
  // Card click → map pe zoom
  card.addEventListener('click', function() {
    map.setView([data.lat, data.lng], 14, { animate: true })
    closeSidebarFn()
  })
  return card
}

function renderIssuesList(problems) {
  const list = document.getElementById('issuesList')
  list.innerHTML = ''

  const filtered = currentFilter === 'all'
    ? problems
    : problems.filter(p => p.category === currentFilter)

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Koi issue nahi mila</p>
      </div>
    `
    return
  }

  filtered.forEach((data, i) => {
    const card = makeIssueCard(data)
    card.style.animationDelay = `${i * 0.05}s`
    list.appendChild(card)
  })
}

// ================================
// UPDATE PROBLEM COUNT
// ================================
function updateCount(count) {
  const el = document.getElementById('problemCount')
  el.textContent = `${count} issue${count !== 1 ? 's' : ''} reported`
}

// ================================
// LOAD ALL PROBLEMS ON PAGE LOAD
// ================================
async function loadProblems() {
  try {
    let res = await fetch("http://localhost:5000/api/problems/all")
    if (!res.ok) throw new Error("Load failed")
    let problems = await res.json()
    allProblems = problems

    problems.forEach(data => addMarker(data))
    updateCount(problems.length)
    renderIssuesList(problems)

  } catch (err) {
    console.log("Problems load error:", err)
    document.getElementById('problemCount').textContent = 'Server se connect nahi hua'
    document.getElementById('issuesList').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>Server chal raha hai?<br>node server.js run karo</p>
      </div>
    `
  }
}

loadProblems()

// ================================
// FILTER BUTTONS
// ================================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
    this.classList.add('active')
    currentFilter = this.dataset.filter
    renderIssuesList(allProblems)
  })
})

// ================================
// MAP CLICK — LOCATION SELECT
// ================================
map.on('click', function(e) {
  selectedLat = e.latlng.lat
  selectedLng = e.latlng.lng

  // Modal location text update
  document.getElementById('modalLocation').textContent =
    `📍 ${selectedLat.toFixed(4)}, ${selectedLng.toFixed(4)}`

  openModal()
})

// ================================
// HINT TOAST — PAGE LOAD PE DIKHAO
// ================================
window.addEventListener('load', function() {
  const hint = document.getElementById('hintToast')
  setTimeout(() => hint.classList.add('show'), 1000)
  setTimeout(() => hint.classList.remove('show'), 5000)
})

// ================================
// SIDEBAR OPEN/CLOSE
// ================================
function openSidebar() {
  document.getElementById('sidebar').classList.add('open')
  document.getElementById('sidebarOverlay').classList.add('show')
}

function closeSidebarFn() {
  document.getElementById('sidebar').classList.remove('open')
  document.getElementById('sidebarOverlay').classList.remove('show')
}

document.getElementById('toggleSidebar').addEventListener('click', openSidebar)
document.getElementById('closeSidebar').addEventListener('click', closeSidebarFn)
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebarFn)

// ================================
// REPORT BUTTON (floating)
// ================================
document.getElementById('reportBtn').addEventListener('click', function() {
  if (selectedLat === null || selectedLng === null) {
    // Hint toast dikhao
    const hint = document.getElementById('hintToast')
    hint.classList.add('show')
    setTimeout(() => hint.classList.remove('show'), 3000)
    return
  }
  openModal()
})

// ================================
// MODAL OPEN/CLOSE
// ================================
function openModal() {
  const modal = document.getElementById('reportModal')
  modal.style.display = 'flex'
  setTimeout(() => modal.classList.add('show'), 10)
}

function closeModal() {
  const modal = document.getElementById('reportModal')
  modal.classList.remove('show')
  setTimeout(() => modal.style.display = 'none', 300)
}

document.getElementById('closeModal').addEventListener('click', closeModal)

document.getElementById('reportModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal()
})

// ESC key se band ho
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal()
})

// ================================
// FORM SUBMIT
// ================================
document.getElementById('problemForm').addEventListener('submit', async function(e) {
  e.preventDefault()

  if (selectedLat === null || selectedLng === null) {
    alert("⚠️ Map pe pehle location select karo!")
    return
  }

  const name = document.getElementById('name').value.trim()
  const categoryInput = document.querySelector('input[name="category"]:checked')
  const description = document.getElementById('description').value.trim()

  if (!categoryInput) {
    alert("⚠️ Problem type select karo!")
    return
  }

  const category = categoryInput.value
  const submitBtn = document.getElementById('submitBtn')
  const submitText = document.getElementById('submitText')
  const btnLoader = document.getElementById('btnLoader')

  // Loading state
  submitText.textContent = 'Submitting...'
  btnLoader.style.display = 'block'
  submitBtn.disabled = true

  try {
    let res = await fetch("http://localhost:5000/api/problems/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, category, description,
        lat: selectedLat,
        lng: selectedLng
      })
    })

    if (!res.ok) throw new Error("Server error")

    let data = await res.json()

    // Map pe marker add karo
    addMarker(data)

    // List mein add karo
    allProblems.unshift(data)
    updateCount(allProblems.length)
    renderIssuesList(allProblems)

    // Modal band karo
    closeModal()
    this.reset()
    selectedLat = null
    selectedLng = null

    // Success toast dikhao
    showSuccessToast()

  } catch (err) {
    console.log(err)
    alert("❌ Backend connect nahi ho raha. Server chal raha hai?")
  } finally {
    submitText.textContent = 'Submit Report'
    btnLoader.style.display = 'none'
    submitBtn.disabled = false
  }
})

// ================================
// SUCCESS TOAST
// ================================
function showSuccessToast() {
  const toast = document.getElementById('successToast')
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 3000)
}