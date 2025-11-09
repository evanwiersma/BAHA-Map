mapboxgl.accessToken = 'pk.eyJ1IjoiY3dpbG1vdHQiLCJhIjoiY2s2bWRjb2tiMG1xMjNqcDZkbGNjcjVraiJ9.2nNOYL23A1cfZSE4hdC9ew';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cwilmott/cmg5px11u00ef01sm3fr65ro0',
    center: [-122.27, 37.8],
    zoom: 9
});

// Add MapboxGeocoder (default address search)
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
        data: 'https://raw.githubusercontent.com/cwilmott/c183-webmap/refs/heads/main/data/183-data.geojson'
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
        const coords = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;

        const popupContent = `
            <div>
                <h3>${props.Landmark}</h3>
                <p><strong>Address:</strong> ${props.Address}</p>
                <p><strong>Architect & Date:</strong> ${props.Architect_Date}</p>
                <p><strong>Designated:</strong> ${props.Designated}</p>
                ${props.Link ? `<p><a href="${props.Link}" target="_blank">More Information</a></p>` : ''}
                ${props.Notes ? `<p><strong>Notes:</strong> ${props.Notes}</p>` : ''}
            </div>
        `;

        new mapboxgl.Popup()
            .setLngLat(coords)
            .setHTML(popupContent)
            .addTo(map);
    });

    // Change cursor on hover
    map.on('mouseenter', 'points-layer', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'points-layer', () => map.getCanvas().style.cursor = '');
});
