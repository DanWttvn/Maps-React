import React, { Fragment } from 'react';
import {BrowserRouter, Route, Switch } from "react-router-dom";
import './index.css';
import Skateparks from './components/Mapbox/Skateparks'
import Crimes from './components/Mapbox/Crimes'
// import Leaflet from './components/Leaflet/Leaflet'

function App() {


	return (
		<BrowserRouter>
			<div className="App">
				<Fragment>
					<Switch>
						<Route exact path="/" component={Crimes} />
						<Route exact path="/skateparks" component={Skateparks} />
						{/* <Route exact path="/leaflet" component={Leaflet} /> */}
					</Switch>
				</Fragment>
			</div>
		</BrowserRouter>	
	);
}

export default App;
