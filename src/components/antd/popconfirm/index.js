var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React from 'react';
import Tooltip from '../tooltip';
import Icon from '../icon';
import Button from '../button';
import injectLocale from '../locale-provider/injectLocale';
class Popconfirm extends React.Component {
    constructor(props) {
        super(props);
        this.onConfirm = (e) => {
            this.setVisible(false);
            const { onConfirm } = this.props;
            if (onConfirm) {
                onConfirm.call(this, e);
            }
        };
        this.onCancel = (e) => {
            this.setVisible(false);
            const { onCancel } = this.props;
            if (onCancel) {
                onCancel.call(this, e);
            }
        };
        this.onVisibleChange = (visible) => {
            this.setVisible(visible);
        };
        this.state = {
            visible: props.visible,
        };
    }
    componentWillReceiveProps(nextProps) {
        if ('visible' in nextProps) {
            this.setState({ visible: nextProps.visible });
        }
    }
    getPopupDomNode() {
        return this.refs.tooltip.getPopupDomNode();
    }
    setVisible(visible) {
        const props = this.props;
        if (!('visible' in props)) {
            this.setState({ visible });
        }
        const { onVisibleChange } = props;
        if (onVisibleChange) {
            onVisibleChange(visible);
        }
    }
    render() {
        const _a = this.props, { prefixCls, title, placement, okText, okType, cancelText } = _a, restProps = __rest(_a, ["prefixCls", "title", "placement", "okText", "okType", "cancelText"]);
        const popconfirmLocale = this.getLocale();
        const overlay = (React.createElement("div", null,
            React.createElement("div", { className: `${prefixCls}-inner-content` },
                React.createElement("div", { className: `${prefixCls}-message` },
                    React.createElement(Icon, { type: "exclamation-circle" }),
                    React.createElement("div", { className: `${prefixCls}-message-title` }, title)),
                React.createElement("div", { className: `${prefixCls}-buttons` },
                    React.createElement(Button, { onClick: this.onCancel, size: "small" }, cancelText || popconfirmLocale.cancelText),
                    React.createElement(Button, { onClick: this.onConfirm, type: okType, size: "small" }, okText || popconfirmLocale.okText)))));
        return (React.createElement(Tooltip, Object.assign({}, restProps, { prefixCls: prefixCls, placement: placement, onVisibleChange: this.onVisibleChange, visible: this.state.visible, overlay: overlay, ref: "tooltip" })));
    }
}
Popconfirm.defaultProps = {
    prefixCls: 'ant-popover',
    transitionName: 'zoom-big',
    placement: 'top',
    trigger: 'click',
    okType: 'primary',
};
const injectPopconfirmLocale = injectLocale('Popconfirm', {
    cancelText: '取消',
    okText: '确定',
});
export default injectPopconfirmLocale(Popconfirm);
