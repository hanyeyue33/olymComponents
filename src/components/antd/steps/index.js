import * as React from 'react';
import PropTypes from 'prop-types';
import RcSteps from 'rc-steps';
export default class Steps extends React.Component {
    render() {
        return (React.createElement(RcSteps, Object.assign({}, this.props)));
    }
}
Steps.Step = RcSteps.Step;
Steps.defaultProps = {
    prefixCls: 'ant-steps',
    iconPrefix: 'ant',
    current: 0,
};
Steps.propTypes = {
    prefixCls: PropTypes.string,
    iconPrefix: PropTypes.string,
    current: PropTypes.number,
};
