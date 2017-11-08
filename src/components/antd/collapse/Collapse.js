import React from 'react';
import RcCollapse from 'rc-collapse';
import classNames from 'classnames';
import animation from '../_util/openAnimation';
export class CollapsePanel extends React.Component {
}
export default class Collapse extends React.Component {
    render() {
        const { prefixCls, className = '', bordered } = this.props;
        const collapseClassName = classNames({
            [`${prefixCls}-borderless`]: !bordered,
        }, className);
        return React.createElement(RcCollapse, Object.assign({}, this.props, { className: collapseClassName }));
    }
}
Collapse.Panel = RcCollapse.Panel;
Collapse.defaultProps = {
    prefixCls: 'ant-collapse',
    bordered: true,
    openAnimation: Object.assign({}, animation, { appear() { } }),
};
