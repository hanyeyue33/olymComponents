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
import classNames from 'classnames';
function generator(props) {
    return (BasicComponent) => {
        return class Adapter extends React.Component {
            render() {
                const { prefixCls } = props;
                return React.createElement(BasicComponent, Object.assign({ prefixCls: prefixCls }, this.props));
            }
        };
    };
}
class Basic extends React.Component {
    render() {
        const _a = this.props, { prefixCls, className, children } = _a, others = __rest(_a, ["prefixCls", "className", "children"]);
        const divCls = classNames(className, prefixCls);
        return (React.createElement("div", Object.assign({ className: divCls }, others), children));
    }
}
class BasicLayout extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { siders: [] };
    }
    getChildContext() {
        return {
            siderHook: {
                addSider: (id) => {
                    this.setState({
                        siders: [...this.state.siders, id],
                    });
                },
                removeSider: (id) => {
                    this.setState({
                        siders: this.state.siders.filter(currentId => currentId !== id),
                    });
                },
            },
        };
    }
    render() {
        const _a = this.props, { prefixCls, className, children } = _a, others = __rest(_a, ["prefixCls", "className", "children"]);
        const divCls = classNames(className, prefixCls, {
            [`${prefixCls}-has-sider`]: this.state.siders.length > 0,
        });
        return (React.createElement("div", Object.assign({ className: divCls }, others), children));
    }
}
BasicLayout.childContextTypes = {
    siderHook: PropTypes.object,
};
const Layout = generator({
    prefixCls: 'ant-layout',
})(BasicLayout);
const Header = generator({
    prefixCls: 'ant-layout-header',
})(Basic);
const Footer = generator({
    prefixCls: 'ant-layout-footer',
})(Basic);
const Content = generator({
    prefixCls: 'ant-layout-content',
})(Basic);
Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;
export default Layout;
