import './SizeTool.scss'

import { ArrowLeft, ArrowRight } from '../../Utility/svg-loader'

function SizeTool(props) {

  return (
    <div className={props.ctrClass}>
      {!props.isBaseBoard && <button className="adjust-button" data-dimension={props.dimension} data-adjustment='decrement' onClick={props.handleSizeAdjust} disabled={props.isBaseBoard}>
        <ArrowLeft className='adjust-button__arrow' />
      </button>}
      <div className={"display" + (props.isBaseBoard ? ' display--baseBoard' : "")}>
        {props.value}
      </div>
      {!props.isBaseBoard && <button className="adjust-button" data-dimension={props.dimension} data-adjustment='increment' onClick={props.handleSizeAdjust} disabled={props.isBaseBoard}>
        <ArrowRight className='adjust-button__arrow' />
      </button>}
    </div>
  )
}

export default SizeTool;