import React, { Component } from 'react'

export class DateFilter extends Component {

	state = {
		// there i data from 2017-10 to 2020-05
		crimeYear: [
			"2020",
			"2019",
			"2018",
			"2017",
		],
		crimeMonth: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ],

		// Default values
		selectedYear: "2020",
		selectedMonth: "05",
	}
	
	render() {

		// Check Categories
		const handleToggle = (e, dateType) => {
			let { selectedYear, selectedMonth } = this.state
			
			if(dateType === "year") {
				selectedYear = e.target.value
				this.setState({
					selectedYear: e.target.value
				})
			} else if(dateType === "month") {
				selectedMonth = e.target.value
				this.setState({
					selectedMonth: e.target.value
				})
			}
			
			const selectedDate = `${selectedYear}-${selectedMonth}`

			// Send to parent component:
			this.props.handleFilters(selectedDate)
		} 


		return (
			<div>
				<p>Select a date:</p>
				{/* Dropdown año y mes separado. Cada vez que cambia uno se lanza */}
				<select name="year" id="year" 
					onChange={(e) => handleToggle(e, "year")}
					defaultValue={this.state.selectedYear}
				>
					{this.state.crimeYear.map((year, i) => (
						<option key={i} value={year}>{year}</option>
					))}
				</select>

				<select name="month" id="month" 
					onChange={(e) => handleToggle(e, "month")}
					defaultValue={this.state.selectedMonth}
				>
					{this.state.crimeMonth.map((month, i) => (
						<option key={i} value={month}>{month}</option>
					))}
				</select>				
			</div>
		)
	}
}

export default DateFilter
