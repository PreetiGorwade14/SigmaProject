mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates, //[longitude,latitude]
  zoom: 9,
});
// const coordinates = data.features[0].center;

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`))
.addTo(map);
