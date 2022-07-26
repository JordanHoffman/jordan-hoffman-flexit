import React from 'react';
import './FlexBlock.scss';

class FlexBlock extends React.Component {

  render(){
    let className = 'flexblock';
    const base=className;
    console.log(this.props.details);
    if (this.props.details.isBaseBoard) className += ` ${base}--base-board`;
    if (this.props.details.direction === "column") className += ` ${base}--dir-column`;

    return(
      <div className={className}>
        {this.props.children}
      </div>
    )
  }
}

FlexBlock.defaultProps = {
  details:{}
};

export default FlexBlock;