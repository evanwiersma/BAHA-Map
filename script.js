mapboxgl.accessToken = 'pk.eyJ1IjoiZXZhbndpZXJzbWEiLCJhIjoiY21oOXMzMWZxMTdiMTJrcTNjMGRyb2NtbSJ9.KVDmztD9nwgkx6cyE0_pHg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/evanwiersma/cmh9s81ce00qr01sre2df9sih', // your custom style
    center: [-122.27, 37.8],
    zoom: 12
});

map.on('load', function() {
    // Add your GeoJSON source
    map.addSource('points-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/evanwiersma/BAHA-Map/refs/heads/main/data/183data.geojson'
    });

    // Add the points layer
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

    // Popups when clicking points
    map.on('click', 'points-layer', (e) => {
        const coords = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;

        const popupContent = `
            <div>
                <h3>${props.Landmarks}</h3>
                <p><strong>Address:</strong> ${props.Address}</p>
                <p><strong>Architect & Date:</strong> ${props["Architect & Date"]}</p>
                <p><strong>Designated:</strong> ${props.Designated}</p>
                ${props["Link "] ? `<p><a href="${props["Link "]}" target="_blank">More Information</a></p>` : ''}
                ${props.Notes ? `<p><strong>Notes:</strong> ${props.Notes}</p>` : ''}
            </div>
        `;

        new mapboxgl.Popup()
            .setLngLat(coords)
            .setHTML(popupContent)
            .addTo(map);
    });

    // Cursor changes on hover
    map.on('mouseenter', 'points-layer', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'points-layer', () => map.getCanvas().style.cursor = '');
});
