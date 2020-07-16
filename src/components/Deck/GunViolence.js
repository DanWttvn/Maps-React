import React, { Fragment, useState } from 'react';
import DeckGL from '@deck.gl/react'
import { StaticMap } from 'react-map-gl'
import { HexagonLayer } from '@deck.gl/aggregation-layers'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { ScatterplotLayer } from '@deck.gl/layers'

// https://www.youtube.com/watch?v=e_5W-JF_E2U

// Setup map
const initialViewState = {
	longitude: -122.41669,
	latitude: 37.7853,
	zoom: 4,
	width: "100vw",
	height: "100vh",
	pitch: 0,
	bearing: 0
}


function InitialDeck() {
	const [hoverInfo, setHoverInfo] = useState(null);

	// Scatterpot
	const scatterplot = new ScatterplotLayer({
		id: "scatter",
		data: "/gundata.json",
		opacity: 0.8,
		filled: true,
		radiusMinPixels: 2,
		radiusMaxPixels: 5,
		getPosition: d => [d.longitude, d.latitude],
		getFillColor: d => d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100], // red if deads, oranjje if injuries
		// Markers
		pickable: true,
		// Update app state
		onHover: info => setHoverInfo(info)
	})

	// Cluster Heatmap
	const heatmap = new HeatmapLayer({
		id: "heat",
		data: "/gundata.json",
		getPosition: d => [d.longitude, d.latitude],
		getWeight: d => d.n_killed + (d.n_injured * 0.5),
		radiusPixels: 60
	})


	const hexagon = new HexagonLayer({
		id: "hex",
		data: "/gundata.json",
		getPosition: d => [d.longitude, d.latitude],
		extruded: true,
		getElevationWeight: d => (d.n_killed * 2) + d.n_injured,
		elevationScale: 500
	})

	const layers = [scatterplot, heatmap, hexagon]


	return (
		<Fragment>
			<DeckGL
				initialViewState={initialViewState}
				controller={true}

				// layers={scatterplot}
				// layers={heatmap}
				// layers={hexagon}

				layers={layers}
			>
				{hoverInfo && hoverInfo.object && (
					<div style={{
						position: 'absolute', 
						zIndex: 1, 
						pointerEvents: 'none', 
						left: hoverInfo.x, 
						top: hoverInfo.y,
						background: "rgba(0, 0, 0, 0.7)",
						color: "#fff",
						padding: "10px 20px"
					}}>
						<p>{hoverInfo.object.incident_id} Killed: {hoverInfo.object.n_killed}</p>
					</div>
				)}

				<StaticMap 
					mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} 
					mapStyle="mapbox://styles/danielawg/ckcndkuwr16jx1iqezrf2lo6g" 
				/>
			</DeckGL>
		</Fragment>
	);
}

export default InitialDeck;
