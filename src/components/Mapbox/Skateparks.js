import React, { useState, useEffect, Fragment } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import * as parkData from '../../data/skateboard-parks.json'


function Skateparks() {

	// Setup map
	const [viewport, setViewport] = useState({
		latitude: 45.4211,
		longitude: -75.6903,
		zoom: 10,
		width: "100vw",
		height: "100vh"
	});
	
	const [selectedPark, setSelectedPark] = useState(null)


	// Closes popup on Escape click
	useEffect(() => {
		const listener = e => {
			if(e.key === "Escape") {
				setSelectedPark(null)
			}
		}
		window.addEventListener("keydown", listener)

		// When the App component is unmounted:
		return () => {
			window.removeEventListener("keydown", listener)
		}
	}, [])


	return (
		<Fragment>
			<ReactMapGL 
				{...viewport} 
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
				mapStyle="mapbox://styles/danielawg/ckcndkuwr16jx1iqezrf2lo6g" // from studio.mapbox > options > style url
				onViewportChange={viewport => {setViewport(viewport)}} // permite moverse por el mapa
			>
				{parkData.features.map(park => (
					<Marker key={park.properties.PARK_ID} 
						latitude={park.geometry.coordinates[1]}
						longitude={park.geometry.coordinates[0]}
					>
						<button className="marker-btn"
							onClick={e => {
								e.preventDefault();
								setSelectedPark(park)
							}}
						>
							<img src="skateboard.svg" alt=""/>
						</button>
					</Marker>
				))}

				{selectedPark ? (
					<Popup
						latitude={selectedPark.geometry.coordinates[1]}
						longitude={selectedPark.geometry.coordinates[0]}
						onClose={() => setSelectedPark(null)}
					>
						<div>
							<h2>{selectedPark.properties.NAME}</h2>
							<p>{selectedPark.properties.DESCRIPTIO}</p>
						</div>
					</Popup>

				) : null}
			</ReactMapGL>
		</Fragment>
	);
}

export default Skateparks;
