import React, { useState, Fragment, useRef } from 'react';
import useSwr from 'swr'
import useSupercluster from "use-supercluster";
import ReactMapGL, { Marker, FlyToInterpolator } from 'react-map-gl'


const fetcher = (...args) => fetch(...args).then(response => response.json());


function Crimes() {

	// Setup map
	const [viewport, setViewport] = useState({
		latitude: 52.6376,
		longitude: -1.135171,
		zoom: 12,
		width: "100vw",
		height: "100vh"
	});
	const mapRef = useRef();


	const url = "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10";
	const { data, error } = useSwr(url, fetcher)
	const crimes = data && !error ? data.slice(0,2000) : []

	// for supercluster: GeoJSON Feature objects
	const points = crimes.map(crime => ({
		type: "Feature",
		properties: { 
			cluster: false, 
			crimeId: crime.id, 
			category: crime.category 
		},
		geometry: {
			type: "Point",
			coordinates: [
				parseFloat(crime.location.longitude),
				parseFloat(crime.location.latitude)
			]
		}
	}))

	// get map bounds. mr.current is ReactMapGL bcause of the ref={mapRef}
	const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null

	// get clusters
	const { clusters, supercluster } = useSupercluster({
		points,
		zoom: viewport.zoom,
		bounds,
		options: {radius: 75, maxZoom: 20} // with the radius I controle how many clusters
	})


	return (
		<Fragment>
			<ReactMapGL 
				{...viewport} // deconstructed
				maxZoom={20}
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
				mapStyle="mapbox://styles/danielawg/ckcndkuwr16jx1iqezrf2lo6g" // from studio.mapbox > options > style url
				onViewportChange={viewport => {setViewport(viewport)}} // permite moverse por el mapa
				ref={mapRef}
			>
				{clusters.map(cluster => {

					const [longitude, latitude] = cluster.geometry.coordinates
					const { cluster: isCluster, point_count: pointCount } = cluster.properties // theres a prop cluster:true/false. By : changes the name and by { } destructures


					// CLusters
					if(isCluster) {
						return (
							<Marker key={cluster.id}
								latitude={latitude}
								longitude={longitude}
							>
								<div className="cluster-marker" 
									style={{
										width: `${10 + (pointCount / points.length) * 50}px`, 
										height: `${10 + (pointCount / points.length) * 50}px` 
									}}
									// Expands on cluster click
									onClick={() => {
										// The zoom required to see that zone
										const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20) // Not more zoom than 20
										setViewport({
											...viewport,
											latitude,
											longitude,
											zoom: expansionZoom,
											// transition animation (mapbox props)
											transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
											transitionDuration: "auto"
										})
									}}							
								>
									{pointCount}
								</div>
							</Marker>
						)
					}


					// Individual Points
					return (
						<Marker key={cluster.properties.crimeId}
							latitude={parseFloat(latitude)}
							longitude={parseFloat(longitude)}
						>
							<button className="crime-marker">
								<img src="/custody.svg" alt=""/>
							</button>
						</Marker>
					)
				})}
				
			</ReactMapGL>
		</Fragment>
	);
}

export default Crimes;
