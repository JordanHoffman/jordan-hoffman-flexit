import './DropDownTool.scss'

function DropDownTool(props) {

  return (
    <div className={props.ctrClass}>
      <select 
      // name="category" 
      className='select-dropdown' 
      // value={props.selection} 
      // onChange={this.handleInputChange}
      >

        {props.options.map(option => {
          return (
            <option className='select-dropdown__option' key={option} value={option}>{option}</option>
          )
        })}
      </select>
    </div>
  )
}

export default DropDownTool;