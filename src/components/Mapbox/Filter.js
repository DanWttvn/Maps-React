import React, { Component } from 'react'

export class Filter extends Component {
	state = {
		// https://data.police.uk/api/crime-categories
		crimecategories: [
			{
				url: "all-crime",
				name: "All crime"
			},
			{
				url: "anti-social-behaviour",
				name: "Anti-social behaviour"
			},
			{
				url: "bicycle-theft",
				name: "Bicycle theft"
			},
			{
				url: "burglary",
				name: "Burglary"
			},
			{
				url: "criminal-damage-arson",
				name: "Criminal damage and arson"
			},
			{
				url: "drugs",
				name: "Drugs"
			},
			{
				url: "other-theft",
				name: "Other theft"
			},
			{
				url: "possession-of-weapons",
				name: "Possession of weapons"
			},
			{
				url: "public-order",
				name: "Public order"
			},
			{
				url: "robbery",
				name: "Robbery"
			},
			{
				url: "shoplifting",
				name: "Shoplifting"
			},
			{
				url: "theft-from-the-person",
				name: "Theft from the person"
			},
			{
				url: "vehicle-crime",
				name: "Vehicle crime"
			},
			{
				url: "violent-crime",
				name: "Violence and sexual offences"
			},
			{
				url: "other-crime",
				name: "Other crime"
			}
		],
		checked: []
	}
	
	componentDidMount() {
		// Get Categories
		// axios.get("https://data.police.uk/api/crime-categories")
		// 	.then(res => {
		// 		this.setState({
		// 			crimecategories: res.data
		// 		})
		// 	})
	}
	
	render() {

		// Check Categories
		const handleToggle = (id) => {
			const checked = [...this.state.checked]

			if(checked.indexOf(id) === -1) {
				checked.push(id)
			} else {
				checked.splice(checked.indexOf(id), 1)
			}

			this.setState({ checked })

			// Send to parent component:
			this.props.handleFilters(checked)
		} 

		//* Parece que no se puede buscar varias categorias a la vez, asi que for each cateforia que haga una llamada y los junte

		return (
			<div>
				{this.state.crimecategories.map((cat, i) => (
					<label key={i}
						onChange={() => handleToggle(cat.url)}
					><input type="checkbox" value={cat.url} /> {cat.name}</label>
				))}
				
			</div>
		)
	}
}

export default Filter
