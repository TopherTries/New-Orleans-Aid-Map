function map() {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidG9waGVydHJpZXMiLCJhIjoiY2t0MHVvOHlkMDhudDJ2cDk5NnBpeGI1eiJ9.nCn4ubl8zjkKyqlpU6ZXyQ'
  const map = new mapboxgl.Map({
    container: 'map',
    center: [-90.071533, 29.951065],
    zoom: 11,
    style: 'mapbox://styles/mapbox/streets-v11',
  })

  // Fetch popups from API
  async function getPopups() {
    const res = await fetch('/api/v1/popups')
    const { data } = await res.json()

    // const infoWindow = new mapboxgl.Popup({ offset: 25 }).setText(
    //   'Construction on the Washington Monument began in 1848.'
    // )

    const popups = data.map((popup) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            popup.location.coordinates[0],
            popup.location.coordinates[1],
          ],
        },
        properties: {
          name: popup.title,
          description: [
            popup.body,
            popup.hours,
            popup.location.formattedAddress,
          ],
          icon: 'hospital',
        },
      }
    })

    loadMap(popups)
  }

  // Load map with points
  function loadMap(popups) {
    map.on('load', function () {
      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: popups,
          },
        },
        layout: {
          'icon-image': '{icon}-15',
          'icon-size': 1.15,
          'icon-allow-overlap': true,
          'text-field': '{name}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
          'text-size': 12,
          'text-allow-overlap': true,
        },
      })

      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      map.on('click', 'points', (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice()
        const description = e.features[0].properties.description

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        console.log(description)

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map)
      })

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'points', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'points', () => {
        map.getCanvas().style.cursor = ''
      })
    })
  }

  getPopups()
}

window.onload = map
