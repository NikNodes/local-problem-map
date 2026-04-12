// =====================
// MAP INIT
// =====================
var map = L.map('map').setView([20.5937, 78.9629], 5)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map)

let selectedLat = null
let selectedLng = null

// =====================
// ICONS
// =====================
var redIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41]
})

var yellowIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41]
})

var blueIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41]
})

var greenIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41]
})

// =====================
// GET ICON BY CATEGORY
// =====================
function getIcon(category) {
  if (category === "Road Damage") return redIcon
  if (category === "Garbage") return yellowIcon
  if (category === "Street Light") return blueIcon
  if (category === "Water Leakage") return greenIcon
  return redIcon
}

// =====================
// ADD MARKER TO MAP
// =====================
function addMarker(data) {
  L.marker([data.lat, data.lng], {
    icon: getIcon(data.category)
  }).addTo(map)
    .bindPopup(
      "<b>" + data.name + "</b><br>" +
      "<i>" + data.category + "</i><br>" +
      data.description +
      "<br><small>Status: " + data.status + "</small>"
    )
}

// =====================
// FIX 3: PAGE LOAD PE PURANE PROBLEMS LOAD KARO
// =====================
async function loadProblems() {
  try {
    let res = await fetch("http://localhost:5000/api/problems/all")
    if (!res.ok) throw new Error("Failed to load problems")
    let problems = await res.json()
    problems.forEach(function(data) {
      addMarker(data)
    })
  } catch (err) {
    console.log("Problems load nahi hue:", err)
  }
}

loadProblems()

// =====================
// MAP CLICK — LOCATION SELECT KARO
// =====================
map.on("click", function(e) {
  selectedLat = e.latlng.lat
  selectedLng = e.latlng.lng
  document.getElementById("reportModal").classList.add("show")
})

// =====================
// FIX 6: FLOATING BUTTON SE MODAL OPEN
// =====================
document.getElementById("reportBtn").addEventListener("click", function() {
  // FIX 5: Agar location select nahi ki toh warn karo
  if (selectedLat === null || selectedLng === null) {
    alert("⚠️ Pehle map pe click karke location select karo, phir Report button dabao.")
    return
  }
  document.getElementById("reportModal").classList.add("show")
})

// =====================
// FIX 4: CLOSE BUTTON KAAM KARE
// =====================
document.getElementById("closeModal").addEventListener("click", function() {
  document.getElementById("reportModal").classList.remove("show")
})

// Modal ke bahar click karne par bhi band ho
document.getElementById("reportModal").addEventListener("click", function(e) {
  if (e.target === this) {
    this.classList.remove("show")
  }
})

// =====================
// FORM SUBMIT
// =====================
document.getElementById("problemForm").addEventListener("submit", async function(e) {
  e.preventDefault()

  // FIX 5: Location check before submit
  if (selectedLat === null || selectedLng === null) {
    alert("⚠️ Map pe pehle location select karo!")
    return
  }

  let name = document.getElementById("name").value
  let category = document.getElementById("category").value
  let description = document.getElementById("description").value

  let submitBtn = this.querySelector("button[type='submit']")
  submitBtn.textContent = "Submitting..."
  submitBtn.disabled = true
  document.body.style.cursor = "wait"

  try {
    let res = await fetch("http://localhost:5000/api/problems/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        category,
        description,
        lat: selectedLat,
        lng: selectedLng
      })
    })

    if (!res.ok) throw new Error("Server error")

    let data = await res.json()

    addMarker(data)

    // Modal band karo aur form reset karo
    document.getElementById("reportModal").classList.remove("show")
    document.getElementById("problemForm").reset()

    // Location reset karo taaki next time dobara map se select karna pade
    selectedLat = null
    selectedLng = null

    alert("✅ Problem report ho gayi!")

  } catch (err) {
    console.log(err)
    alert("❌ Backend connect nahi ho raha. Server chal raha hai?")
  } finally {
    submitBtn.textContent = "Submit"
    submitBtn.disabled = false
    document.body.style.cursor = "default"
  }
})