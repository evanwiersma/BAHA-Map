mapboxgl.accessToken = 'pk.eyJ1IjoiZXZhbndpZXJzbWEiLCJhIjoiY21oOXMzMWZxMTdiMTJrcTNjMGRyb2NtbSJ9.KVDmztD9nwgkx6cyE0_pHg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/evanwiersma/cmh9s81ce00qr01sre2df9sih', // your custom style
    center: [-122.27, 37.8],
    zoom: 9
});

// Add search bar (Mapbox Geocoder)
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
    placeholder: 'Search landmarks...'
});
map.addControl(geocoder, 'top-right');

map.on('load', function() {
    // Add GeoJSON source
    map.addSource('points-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/evanwiersma/BAHA-Map/refs/heads/main/data/183data.geojson'
    });

    // Add points layer
    map.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points-data',
        paint: {
            'circle-color': '#4264FB',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Popups on click
    map.on('click', 'points-layer', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;

        const popupContent = `
            <div>
                <h3>${properties.Landmarks}</h3>
                <p><strong>Address:</strong> ${properties.Address}</p>
                <p><strong>Architect & Date:</strong> ${properties["Architect & Date"]}</p>
                <p><strong>Designated:</strong> ${properties.Designated}</p>
                ${properties["Link "] ? `<p><a href="${properties["Link "]}" target="_blank">More Information</a></p>` : ''}
                ${properties.Notes ? `<p><strong>Notes:</strong> ${properties.Notes}</p>` : ''}
            </div>
        `;

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
    });

    // Change cursor on hover
    map.on('mouseenter', 'points-layer', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'points-layer', () => map.getCanvas().style.cursor = '');
});
