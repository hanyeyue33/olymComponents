var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
import PropTypes from 'prop-types';
export default class BreadcrumbItem extends React.Component {
    render() {
        const _a = this.props, { prefixCls, separator, children } = _a, restProps = __rest(_a, ["prefixCls", "separator", "children"]);
        let link;
        if ('href' in this.props) {
            link = React.createElement("a", Object.assign({ className: `${prefixCls}-link` }, restProps), children);
        }
        else {
            link = React.createElement("span", Object.assign({ className: `${prefixCls}-link` }, restProps), children);
        }
        if (children) {
            return (React.createElement("span", null,
                link,
                React.createElement("span", { className: `${prefixCls}-separator` }, separator)));
        }
        return null;
    }
}
BreadcrumbItem.__ANT_BREADCRUMB_ITEM = true;
BreadcrumbItem.defaultProps = {
    prefixCls: 'ant-breadcrumb',
    separator: '/',
};
BreadcrumbItem.propTypes = {
    prefixCls: PropTypes.string,
    separator: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    href: PropTypes.string,
};
