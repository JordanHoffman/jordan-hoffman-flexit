import './SizeTool.scss'

import { ArrowLeft, ArrowRight } from '../../Utility/svg-loader'

function SizeTool(props) {

  return (
    <div className={props.ctrClass}>
      <button className="adjust-button" data-dimension={props.dimension} data-adjustment='decrement' onClick={props.handleSizeAdjust}>
        <ArrowLeft className='adjust-button__arrow' />
      </button>
      <div className="display">
        {props.value}
      </div>
      <button className="adjust-button" data-dimension={props.dimension} data-adjustment='increment' onClick={props.handleSizeAdjust}>
        <ArrowRight className='adjust-button__arrow' />
      </button>
    </div>
  )
}

export default SizeTool;