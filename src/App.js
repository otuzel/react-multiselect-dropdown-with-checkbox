import React from 'react';
import MultiSelect from './components/MultiSelect';

const options = [
  { name: 'Facilities', value: 'facilities' },
  { name: 'Finance', value: 'finance' },
  { name: 'Front Office', value: 'front_office' },
  { name: 'Human Resources', value: 'human_resources' },
  { name: 'IT', value: 'it' },
  { name: 'Management Team', value: 'management_team' },
  { name: 'Planning', value: 'planning' },
  { name: 'Sales', value: 'sales' },
]
const defaultValues = [
  { name: 'Management Team', value: 'management_team' },
  { name: 'Sales', value: 'sales' }
]

class App extends React.Component {
  state = {
    selectedOptions: []
  }
  handleChange = (options) => {
    this.setState(() => {
      return {
        selectedOptions: options
      }
    });
  }
  render() {
    return (
      <div className="wrapper">
        <h1>React Assignment:	Multi-select Dropdown Component</h1>
        <div className="container">
          <MultiSelect 
            options={options}
            defaultValues={defaultValues}
            name="department"
            onChange={this.handleChange}
            />
          <div className="info">
            <section>
              <div className="info__title">Usage:</div>
              You can use &#8593; and &#8595; keys to navigate,
              <br/>
              &#8629; key to select an item,
              <br/>
              and "Esc" key to hide the dropdown.
            </section>
            <section>
              <div className="info__title">Selected options:</div>"
              {
                this.state.selectedOptions.map((option, index) => <span key={option.value}>
                  {(index ? ', ': '') + option.value}
                  </span>
                )
              }
              "
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default App;