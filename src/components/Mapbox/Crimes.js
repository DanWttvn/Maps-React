import React, { useState, Fragment, useRef, useEffect } from 'react';
import axios from 'axios'
import useSupercluster from "use-supercluster";
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from 'react-map-gl'
import CategoryFilter from "./CategoryFilter"
import DateFilter from "./DateFilter"

// https://data.police.uk/api/crimes-street/category?lat=52.629729&lng=-1.131592&date=2019-10

//* tutorial: https://www.youtube.com/watch?v=ArvR-ddOO78

//			1. component did mount all Crimes
// todo:	2. filter by date (radiobox)

// todo:	- display month and outcome (if)
// todo:	- check location

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
		date: "2020-01"
	})

	const [results, setResults] = useState([])


	// First load
	useEffect(() => {
		// If not date, last month by defaulr
		axios.get(`https://data.police.uk/api/crimes-street/all-crimes?lat=52.629729&lng=-1.131592`)
			.then(res => {
				setResults(res.data)
			})
			.catch(err => console.log(err))
	}, [])


	// Closes popup on Escape click
	useEffect(() => { // get called the first time the component gets loaded and everytime the DOM is updated (componentDidMount + ComponentDidUpdate)
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
	}, [activeCrime]) // only called when this variables change (better performance)



	// for supercluster: GeoJSON Feature objects
	const points = results.map(crime => ({
		type: "Feature",
		properties: { 
			cluster: false, 
			crimeId: crime.id, 
			category: crime.category,
			//* we need to set here the data we want to show. 
			// allData: crime
			date: crime.month,
			outcome: crime.outcome_status
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

	
	const getFilteredResults = async filters => {
		let newResults = []
		setResults([])

		if(filters.category.length === 0) {
			axios.get(`https://data.police.uk/api/crimes-street/all-crimes?lat=52.629729&lng=-1.131592&date=${filters.date}`)
				.then(res => {
					setResults(res.data)
					// console.log(typeof(res.data));
				})
				.catch(err => console.log(err))
		} else {
			// Waits until all the calls are made to set the result
			await Promise.all(
				filters.category.map(async (filter) => {
					const res = await axios.get(`https://data.police.uk/api/crimes-street/${filter}?lat=52.629729&lng=-1.131592&date=${filters.date}`)
					const newData = await res.data
					newResults.push(...newData)
				})
			)
			setResults(newResults)
		}
	}
	// console.log(results);


	const handleFilters = (newFilters, type) => {
		filters[type] = newFilters

		getFilteredResults(filters)
		setFilters(filters)
	}

	return (
		<Fragment>

			{/* gets the filters from the child through props */}
			<CategoryFilter handleFilters={newFilters => handleFilters(newFilters, "category")} /> {/* first "newFilters" => is what gets from child. Props name and function name doesnt have to be the same */}
			<DateFilter handleFilters={newFilters => handleFilters(newFilters, "date")} />
			
			<ReactMapGL 
				{...viewport} // deconstructed
				maxZoom={20}
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
				mapStyle="mapbox://styles/danielawg/ckcndkuwr16jx1iqezrf2lo6g" // from studio.mapbox > options > style url
				onViewportChange={viewport => {setViewport(viewport)}} // permite moverse por el mapa
				ref={mapRef}
			>
				{clusters.map(cluster => {
					const [ longitude, latitude ] = cluster.geometry.coordinates
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
									setActiveCrime(cluster)
									// console.log(activeCrime)
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
							<p>{activeCrime.properties.date}</p>
							<p>{activeCrime.properties.outcome.category}</p>
						</div>
					</Popup>
				)}
			</ReactMapGL>
		</Fragment>
	);
}

export default Crimes;
