import React, { Fragment } from 'react';
import DeckGL from '@deck.gl/react'
import { LineLayer } from '@deck.gl/layers'
import { StaticMap } from 'react-map-gl'


// Setup map
const initialViewState = {
	longitude: -122.41669,
	latitude: 37.7853,
	zoom: 13,
	// width: "100vw",
	// height: "100vh",
	pitch: 0,
	bearing: 0
}


// Data in the layer
const data = [
	{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}
];


function InitialDeck() {
	const layers = [
		new LineLayer({
			id: "line-layer",
			data
		})
	]
	return (
		<Fragment>
			<DeckGL
				initialViewState={initialViewState}
				controller={true}
				layers={layers}
			>
				<StaticMap mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} />
			</DeckGL>
		</Fragment>
	);
}

export default InitialDeck;
