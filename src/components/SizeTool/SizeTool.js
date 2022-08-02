import './SizeTool.scss'

function SizeTool(props) {

  return (
    <div className="sizetool">
      <button className="sizetool__adjust" data-dimension={props.dimension} data-adjustment='decrement' onClick={props.handleSizeAdjust}>
        {'<'}
      </button>
      <div className="sizetool__display">
        {props.size}
      </div>
      <button className="sizetool__adjust" data-dimension={props.dimension} data-adjustment='increment' onClick={props.handleSizeAdjust}>
        {'>'}
      </button>
    </div>
  )
}

export default SizeTool;