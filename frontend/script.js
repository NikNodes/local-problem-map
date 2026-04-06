var map = L.map('map').setView([20.5937,78.9629],5)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:19
}).addTo(map)

let selectedLat
let selectedLng

var redIcon = L.icon({
iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
iconSize:[25,41]
})

var yellowIcon = L.icon({
iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
iconSize:[25,41]
})

var blueIcon = L.icon({
iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
iconSize:[25,41]
})

var greenIcon = L.icon({
iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
iconSize:[25,41]
})

function getIcon(category){

if(category=="Road Damage") return redIcon
if(category=="Garbage") return yellowIcon
if(category=="Street Light") return blueIcon
if(category=="Water Leakage") return greenIcon

return redIcon
}

/* MAP CLICK */
map.on("click",function(e){

selectedLat=e.latlng.lat
selectedLng=e.latlng.lng

document.getElementById("closeModal").onclick=function(){
document.getElementById("reportModal").style.display="none"
}

})

/* FORM SUBMIT */
document.getElementById("problemForm").addEventListener("submit",function(e){

e.preventDefault()

let name=document.getElementById("name").value
let category=document.getElementById("category").value
let description=document.getElementById("description").value

L.marker([selectedLat,selectedLng],{
icon:getIcon(category)
}).addTo(map)
.bindPopup("<b>"+name+"</b><br>"+category+"<br>"+description)

document.getElementById("reportModal").style.display="none"

})

/* FLOATING BUTTON */
document.getElementById("reportBtn").onclick=function(){

document.getElementById("reportModal").style.display="flex"

}
