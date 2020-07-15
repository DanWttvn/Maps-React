import React, { Fragment } from 'react';
import {BrowserRouter, Route, Switch } from "react-router-dom";
import './index.css';
import Mapbox from './components/Mapbox/Mapbox'
import Leaflet from './components/Leaflet/Leaflet'

function App() {


	return (
		<BrowserRouter>
			<div className="App">
				<Fragment>
					<Switch>
						<Route exact path="/" component={Mapbox} />
						<Route exact path="/leaflet" component={Leaflet} />
					</Switch>
				</Fragment>
			</div>
		</BrowserRouter>	
	);
}

export default App;
