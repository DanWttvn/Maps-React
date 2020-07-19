import React, { Fragment } from 'react';
import {BrowserRouter, Route, Switch } from "react-router-dom";
import './index.css';
import Skateparks from './components/Mapbox/Skateparks'
import Crimes from './components/Mapbox/Crimes'
import Leaflet from './components/Leaflet/Leaflet'
import GoogleMaps from './components/GoogleMaps/GoogleMaps'
import InitialDeck from './components/Deck/InitialDeck'
import GunViolence from './components/Deck/GunViolence'
import RealState from './components/Mapbox/RealState'


function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Fragment>
					<Switch>
						<Route exact path="/" component={Crimes} />
						<Route exact path="/skateparks" component={Skateparks} />
						<Route exact path="/leaflet" component={Leaflet} />
						<Route exact path="/google-maps" component={GoogleMaps} />
						<Route exact path="/deck-initial" component={InitialDeck} />
						<Route exact path="/gun-violence" component={GunViolence} />
						<Route exact path="/real-state" component={RealState} />
					</Switch>
				</Fragment>
			</div>
		</BrowserRouter>	
	);
}

export default App;
