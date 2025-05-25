const pubs = [
  { name: "The Castle", lat: 51.4275, lon: -0.1686 },
  { name: "The Wheatsheaf", lat: 51.4294, lon: -0.1652 },
  { name: "The Antelope", lat: 51.4269, lon: -0.1668 },
  { name: "The Selkirk", lat: 51.4277, lon: -0.1643 },
  { name: "The Little Bar", lat: 51.4283, lon: -0.1679 },
  { name: "The Corin", lat: 51.4288, lon: -0.1662 },
  { name: "The King's Head", lat: 51.4265, lon: -0.1689 },
  { name: "The Tooting Tram & Social", lat: 51.4289, lon: -0.1655 },
  { name: "Graveney & Meadow", lat: 51.4290, lon: -0.1680 },
  { name: "The Wheatsheaf (Tooting Bec)", lat: 51.4321, lon: -0.1611 }
];

const API_KEY = "5b3ce3597851110001cf6248895cc7021af848feb1828aba0ebf2a1d";

async function calculateRoutes() {
  const input = document.getElementById("location").value;
  const [startLat, startLon] = input.split(',').map(s => parseFloat(s.trim()));

  if (isNaN(startLat) || isNaN(startLon)) {
    alert("Please enter a valid location (e.g. 51.4272, -0.1680)");
    return;
  }

  const jobs = pubs.map((pub, i) => ({
    id: i + 1,
    location: [pub.lon, pub.lat]
  }));

  const vehicles = [
    {
      id: 1,
      start: [startLon, startLat],
      type: "bike"
    }
  ];

  const body = {
    jobs,
    vehicles,
    options: { g: true }
  };

const response = await fetch('https://corsproxy.io/?https://api.openrouteservice.org/optimization', {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  const steps = data.routes[0].steps;

  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = `<h3>Optimized Pub Route (Bike)</h3>`;

  steps.forEach(step => {
    if (step.type === "job") {
      const pub = pubs[step.id - 1];
      resultDiv.innerHTML += `<p><strong>${pub.name}</strong><br>
      <a href="https://www.google.com/maps/search/?api=1&query=${pub.lat},${pub.lon}" target="_blank">
        Open in Maps
      </a></p>`;
    }
  });
}
