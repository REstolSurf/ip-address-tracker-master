let map = null;

function initMap(lat, lng) {
  map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      const ipAddress = data.ip;
      getLocation(ipAddress);
    })
    .catch((error) => {
      console.error("Error getting IP:", error);
    });
});

function checkInputValue() {
  const inputValue = document.getElementById("IP").value;
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let inputIP = inputValue;

  if (domainRegex.test(inputValue)) {
    getIpFromDomain(inputValue).then((ipAddress) => {
      getLocation(ipAddress);
    });
  } else if (!ipRegex.test(inputValue)) {
    alert("You should enter a valid IP or domain.");
  } else {
    getLocation(inputIP);
  }
}

function getIpFromDomain(domain) {

  return fetch(`https://dns.google/resolve?name=${domain}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.Answer && data.Answer.length > 0) {
        //The IP address is in the object where type == 1 / type != 1 is for redirection
        const objTarget = data.Answer.find((obj) => obj.type === 1);
        if (objTarget) return objTarget.data;
        else throw new Error(`IP address not found for ${domain}`);
      } else {
        throw new Error(`IP address not found for ${domain}`);
      }
    });
}

function getLocation(inputIP) {
  const apiKey = "at_Xlg4rXP9NOZbGh2pbivsYIbSXphfL";
  const apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${inputIP}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const ipAddress = data.ip;
      const location =
        data.location.city +
        ", " +
        data.location.country +
        " " +
        data.location.postalCode;
      const timezone = data.location.timezone;
      const isp = data.isp;
      const lat = data.location.lat;
      const lng = data.location.lng;
      console.log(lat, lng, ipAddress, location, timezone);

      //check if map is init
      map !== null ? map.panTo([lat, lng]) : initMap(lat, lng);

      document.getElementById("ipAddress").textContent = ipAddress;
      document.getElementById("location").textContent = location;
      document.getElementById("timezone").textContent = "UTC " + timezone;
      document.getElementById("isp").textContent = isp;
    })
    .catch((error) => {
      console.error("Error getting location:", error);
    });
}

const getLocationBtn = document.getElementById("getLocationBtn");
getLocationBtn.addEventListener("click", checkInputValue);
