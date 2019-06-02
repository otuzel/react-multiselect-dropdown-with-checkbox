import React from 'react';
import './MultiSelect.scss';

class MultiSelect extends React.Component {
  state = {
    ...this.props,
    options: this.props.options || [],
    filteredOptions: this.props.options || [],
    selectedOptions: this.props.defaultValues ? this.props.defaultValues : [],
    dropdownActive: false,
    cursor: 0,
  }
  multiSelectRef = React.createRef();
  textInputRef = React.createRef();
  // Controls the dropdown visibility
  handleDropdownClick = () => {
    this.setState(state => {
      return {
        cursor: 0, 
        dropdownActive: !state.dropdownActive
      }
    }, () => this.resetDropdown());
  }
  resetDropdown = () => {
    if (this.state.dropdownActive) {
      this.textInputRef.current.value = '';
      this.textInputRef.current.focus();
      this.setState(state => {
        return {
          filteredOptions: [...state.options]
        }
      });
    }
  }
  // Handle search and keyboard events
  handleSearchChange = (e) => {
    e.persist();
    this.setState(() => {
      const filter = new RegExp(e.target.value, 'i');
      const filteredOptions = this.state.options.filter(opt => {
        return filter.test(opt.value);
      });
      return {
        cursor: 0,
        filteredOptions
      }
    });
  }
  // Navigation with arrow keys
  handleSearchKeyDown = (e) => {
    const { cursor } = this.state;
    const key = e.which || e.keyCode || 0;
    if (key === 38 && cursor > 0) {
      this.setState((state) => {
        return {
          cursor: state.cursor - 1
        }
      });
    }
    if (key === 40 && cursor < this.state.filteredOptions.length) {
      this.setState((state) => {
        return {
          cursor: state.cursor + 1
        }
      });
    }
    // Select by enter
    if (key === 13) {
      const highlightedItem = this.state.filteredOptions[this.state.cursor];
      if (!this.state.selectedOptions.find(opt => opt.value === highlightedItem.value)) {
        this.setState((state) => {
          return {
            selectedOptions: [...state.selectedOptions, highlightedItem] 
          }
        }, () => this.props.onChange(this.state.selectedOptions))
      } else {
        this.setState((state) => {
          return {
            selectedOptions: state.selectedOptions.filter(opt => opt.value !== highlightedItem.value)
          }
        }, () => this.props.onChange(this.state.selectedOptions))
      }
    }
  }
  // Handles checking or unchecking of items
  handleOptionChange = (e) => {
    e.persist();
    let newSelectedOptions;
    if(e.target.checked) {
      // New item is added to the chosen items list
      const selectedItem = this.state.options.find(opt => opt.value === e.target.value);
      newSelectedOptions = [...this.state.selectedOptions, selectedItem]
    } else {
      // Unchecked item is removed from the chosen items list
      newSelectedOptions = this.state.selectedOptions.filter(opt => opt.value !== e.target.value)
    }
    this.setState(() => {
      return {
        selectedOptions: newSelectedOptions
      }
    }, () => {
      this.props.onChange(this.state.selectedOptions);
      this.textInputRef.current.focus();
    });
    
  }
  // Remove item with X button
  handleOptionRemoveClick = (value, e) => {
    e.stopPropagation();
    this.setState( state => {
      return {
        selectedOptions: state.selectedOptions.filter(item => item.value !== value)
      }
    }, () => this.props.onChange(this.state.selectedOptions))
  }
  // Hide dropdown if clicked outside
  handleMousedown = (e) => {
    e.stopPropagation();
    if (this.multiSelectRef.current && !this.multiSelectRef.current.contains(e.target)) {
      if (this.state.dropdownActive) {
        this.setState( state => {
          return { 
            dropdownActive: !state.dropdownActive
          }
        });
      }
    }
  }
  // Hide dropdown with ESC key
  handleEscKeyUp = (e) => {
    const key = e.which || e.keyCode || 0;
    if (key === 27) {
      this.setState(() => {
        return {
          dropdownActive: false
        }
      })
    }
  }
  // Check item is already in the chosen items list, if so then make that option checked
  isChecked = (value) => {
    return this.state.selectedOptions.find(item => item.value === value) ? true : false;
  }
  componentDidMount() {
    this.props.onChange(this.state.selectedOptions);
    document.addEventListener('mousedown', this.handleMousedown);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMousedown);
  }
  render() {
    return <div className={`multiselect-wrapper ${this.state.dropdownActive ? 'is-active' : ''}`}
      ref={this.multiSelectRef}>
      <div 
        className="multiselect__control"
        onClick={this.handleDropdownClick}>
        <span className={`multiselect__placeholder ${this.state.selectedOptions.length ? 'is-hidden' : ''}`}>Choose department...</span>
        <span className={`multiselect__arrow-icon fa ${this.state.dropdownActive ? 'fa-chevron-up' : 'fa-chevron-down'}`}></span>
        <ul className="multiselect-choices">
          {
            this.state.selectedOptions.map(option => <li key={option.value} className="multiselect-choices__item">
                {option.name}
                <span className="multiselect__remove-icon fa fa-times" onClick={(e) => this.handleOptionRemoveClick(option.value, e)}></span>
              </li>
            )
          }
        </ul>
        <input 
          type="hidden"
          value={this.state.selectedOptions.map(opt => opt.value)}
          name={this.state.name}
          />
      </div>
      <div className={`multiselect__result-area ${this.state.dropdownActive ? 'is-active' : ''}`}>
        <div className="multiselect__search-area">
          <input 
            className="multiselect__search-input" 
            type="text"
            ref={this.textInputRef}
            placeholder="Search..."
            onChange={this.handleSearchChange}
            onKeyDown={this.handleSearchKeyDown}
            onKeyUp={this.handleEscKeyUp}
            />
          <span className="fa fa-search multiselect__search-icon"></span>
        </div>
        <ul className="multiselect-results">
        {
          this.state.filteredOptions.map((option, index) => <li 
            key={option.value} 
            className={`multiselect-results__item ${this.isChecked(option.value) ? 'is-active' : ''} ${index === this.state.cursor ? 'is-highlighted' : ''}`}>
            <input 
              type="checkbox" 
              onChange={this.handleOptionChange}
              className="custom-checkbox" 
              id={`opt-${option.value}`} 
              value={option.value}
              checked = {this.isChecked(option.value)}
              />
            <label 
              htmlFor={`opt-${option.value}`} 
              className="custom-checkbox-label">{option.name}
            </label>
          </li>)
        } 
      </ul>
      </div>
    </div> 
  }
}

export default MultiSelect; 