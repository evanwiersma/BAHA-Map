mapboxgl.accessToken = 'pk.eyJ1IjoiY3dpbG1vdHQiLCJhIjoiY2s2bWRjb2tiMG1xMjNqcDZkbGNjcjVraiJ9.2nNOYL23A1cfZSE4hdC9ew';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cwilmott/cmg5px11u00ef01sm3fr65ro0',
    center: [-122.27, 37.8],
    zoom: 9
});

map.on('load', function() {

    // Add your points source
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

    // Popup on click
    map.on('click', 'points-layer', (e) => {
        const coords = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;

        const popupContent = `
            <div>
                <h3>${props.Landmark}</h3>
                <p><strong>Address:</strong> ${props.Address}</p>
            </div>
        `;

        new mapboxgl.Popup()
            .setLngLat(coords)
            .setHTML(popupContent)
            .addTo(map);
    });

    map.on('mouseenter', 'points-layer', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'points-layer', () => map.getCanvas().style.cursor = '');

    // --- CUSTOM GEOCODER ---
    // Fetch the GeoJSON separately for the geocoder
    fetch('https://raw.githubusercontent.com/cwilmott/c183-webmap/refs/heads/main/data/183-data.geojson')
        .then(res => res.json())
        .then(data => {

            function customGeocoder(query) {
                return data.features
                    .filter(f => f.properties.Landmark.toLowerCase().includes(query.toLowerCase()))
                    .map(f => ({
                        type: 'Feature',
                        geometry: f.geometry,
                        properties: {
                            name: f.properties.Landmark, // <-- must be `name` for the dropdown
                            title: f.properties.Landmark
                        }
                    }));
            }

            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                marker: false,
                localGeocoder: customGeocoder,
                placeholder: 'Search landmarks...'
            });

            map.addControl(geocoder, 'top-right');
        });
});
