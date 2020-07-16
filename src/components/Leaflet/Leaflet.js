import React, { useState } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { Icon } from 'leaflet'
import useSwr from "swr"

const fetcher = (...args) => fetch(...args).then(response => response.json())

const icon = new Icon({
	iconUrl: "/custody.svg",
	iconSize: [25, 25]
})

const Leaflet = () => {

	const url = "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10";
	const { data, error } = useSwr(url, fetcher)
	const crimes = data && !error ? data.slice(0,100) : []

	const [activeCrime, setActiveCrime] = useState(null)
	

	return (
		<Map center={[52.6376, -1.135171]} zoom={12}>
			{/* Required: */}
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			/>

			{crimes.map(crime => (
				<Marker key={crime.id}
					position={[crime.location.latitude, crime.location.longitude]}
					icon={icon}
					onclick={() => setActiveCrime(crime)}
				>
				</Marker>
			))}

			{activeCrime && (
				<Popup 
					position={[activeCrime.location.latitude, activeCrime.location.longitude]}
					onClose={() => setActiveCrime(null)}
				>
					<div>
						<h2>{activeCrime.category}</h2>
					</div>
				</Popup>
			)}
		</Map>
	)
}


export default Leaflet
