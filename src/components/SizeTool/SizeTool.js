import './SizeTool.scss'

function SizeTool(props) {
  return (
    <div className="sizetool">
      <button className="sizetool__adjust">
        {'<'}
      </button>
      <div className="sizetool__display">
        {props.size}
      </div>
      <button className="sizetool__adjust">
        {'>'}
      </button>
    </div>
  )
}

export default SizeTool;