import React, { useState, Fragment, useRef, useEffect } from 'react';
import axios from 'axios'
import useSupercluster from "use-supercluster";
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from 'react-map-gl'
import Filter from "./Filter"

// https://data.police.uk/api/crimes-street/category?lat=52.629729&lng=-1.131592&date=2019-10

//* tutorial: https://www.youtube.com/watch?v=ArvR-ddOO78

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
	const [activeCrime, setActiveCrime] = useState(null)
	const [filters, setFilters] = useState({
		category: [],
		date: "2019-10"
	})

	const [results, setResults] = useState([])



	// Closes popup on Escape click
	useEffect(() => {
		const listener = e => {
			if(e.key === "Escape") {
				setActiveCrime(null)
			}
		}
		window.addEventListener("keydown", listener)

		// When the App component is unmounted:
		return () => {
			window.removeEventListener("keydown", listener)
		}
	}, [])


	// for supercluster: GeoJSON Feature objects
	const points = results.map(crime => ({
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


	// se sigue haciendo un lio. buscar how to merge response of several api calls 
	// ! parece que con la promise mercge calls pero por alguna razon se guarda de forma distinta y eso no lo display
	
	const getFilteredResults = filters => {
		let newResults = []
		// let newResults = {}

		setResults([])

		if(filters.category.length === 0) {
			axios.get(`https://data.police.uk/api/crimes-street/all-crimes?lat=52.629729&lng=-1.131592&date=${filters.date}`)
				.then(res => {
					setResults(res.data)
					// console.log(typeof(res.data));
				})
				.catch(err => console.log(err))
		} else {
			// filters.category.forEach(filter => {
			// 	// console.log(filter);
			// 	axios.get(`https://data.police.uk/api/crimes-street/${filter}?lat=52.629729&lng=-1.131592&date=${filters.date}`)
			// 		.then(res => {
			// 			newResults.push(...res.data)
			// 			setResults(newResults)
			// 		})
			// 		.catch(err => console.log(err))
			// });

			// const getAllData = () => {
			// 	filters.category.forEach((filter, i) => {
			// 		// console.log(filter);
			// 		axios.get(`https://data.police.uk/api/crimes-street/${filter}?lat=52.629729&lng=-1.131592&date=${filters.date}`)
			// 			.then(res => {
			// 				// for each call create a variable with diff name
			// 				newResults[`${i}`] = res.data
			// 			})
			// 			.catch(err => console.log(err))
			// 	});
			// } 

			// Promise.all([
			// 	getAllData()
			// ]).then(
			// 	// const
			// 	setResults(newResults)
			// 	// console.log(typeof(newResults))
			// )


			// Promise.all([
			// 	filters.category.forEach(filter => {
			// 		axios.get(`https://data.police.uk/api/crimes-street/${filter}?lat=52.629729&lng=-1.131592&date=${filters.date}`)
			// 			.then(res => {
			// 				newResults.push(...res.data)
			// 			})
			// 			.catch(err => console.log(err))
			// 	})
			// ]).then(
			// 	setResults(newResults)
			// 	// console.log(typeof(newResults))
			// )



			const getAllData = () => {
				filters.category.forEach(filter => {
					// console.log(filter);
					axios.get(`https://data.police.uk/api/crimes-street/${filter}?lat=52.629729&lng=-1.131592&date=${filters.date}`)
						.then(res => {
							// for each call create a variable with diff name
							newResults.push(...res.data)
						})
						.catch(err => console.log(err))
				});
			} 

			Promise.all([
				getAllData()
			]).then(
				setResults(newResults)
				// console.log(typeof(newResults))
			)

		}
	}

	console.log(results);


	const handleFilters = (newFilters, type) => {
		filters[type] = newFilters
		
		// if(type === "date")

		getFilteredResults(filters)
		setFilters(filters)
	}


	return (
		<Fragment>

			{/* gets the filters from the child through props */}
			<Filter handleFilters={newFilters => handleFilters(newFilters, "category")} /> {/* first filters => is what gets from child. Props name and function name doesnt have to be the same */}
			
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
							<button className="crime-marker"
								onClick={e => {
									e.preventDefault();
									console.log(activeCrime)
									setActiveCrime(cluster)
								}}
							>
								<img src="/custody.svg" alt=""/>
							</button>
						</Marker>
					)
				})}
				
				{/* Popups */}
				{activeCrime && (
					<Popup 
						latitude={activeCrime.geometry.coordinates[1]}
						longitude={activeCrime.geometry.coordinates[0]}
						onClose={() => setActiveCrime(null)}
					>
						<div>
							<h2>{activeCrime.properties.category}</h2>
						</div>
					</Popup>
				)}
			</ReactMapGL>
		</Fragment>
	);
}

export default Crimes;
