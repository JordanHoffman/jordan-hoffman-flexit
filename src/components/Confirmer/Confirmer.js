import React from 'react';
import './Confirmer.scss'

import { Cancel, Confirm } from '../../Utility/svg-loader'

function Confirmer(props) {
  return (
    <div className={props.ctrClass + ' confirmer' + (props.visible ? '' : ' confirmer--invisible')}>
      <div className='confirmer__message'>
        {props.message}
      </div>
      <div className='confirmer__options' >
        <button className='confirmer__options-btn' data-confirm='cancel' onClick={props.handleConfirm}>
          <Cancel className='confirmer__options-btn-svg confirmer__options-btn-svg--cancel' />
        </button>
        <button className='confirmer__options-btn confirmer__options-btn--proceed' data-confirm='confirm' onClick={props.handleConfirm}>
          <Confirm className='confirmer__options-btn-svg confirmer__options-btn-svg--confirm' />
        </button>
      </div>

    </div>
  )
}

export default Confirmer;