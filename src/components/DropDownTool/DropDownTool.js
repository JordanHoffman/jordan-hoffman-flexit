import './DropDownTool.scss'

function DropDownTool(props) {

  return (
    <div className={props.ctrClass}>
      <select 
      name={props.name} 
      className='select-dropdown' 
      value={props.value} 
      onChange={props.handleDistribution}
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