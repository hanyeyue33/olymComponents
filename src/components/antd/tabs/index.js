import React, { cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import RcTabs, { TabPane } from 'rc-tabs';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import TabContent from 'rc-tabs/lib/TabContent';
import classNames from 'classnames';
import Icon from '../icon';
import warning from '../_util/warning';
import isFlexSupported from '../_util/isFlexSupported';
export default class Tabs extends React.Component {
    constructor() {
        super(...arguments);
        this.createNewTab = (targetKey) => {
            const onEdit = this.props.onEdit;
            if (onEdit) {
                onEdit(targetKey, 'add');
            }
        };
        this.removeTab = (targetKey, e) => {
            e.stopPropagation();
            if (!targetKey) {
                return;
            }
            const onEdit = this.props.onEdit;
            if (onEdit) {
                onEdit(targetKey, 'remove');
            }
        };
        this.handleChange = (activeKey) => {
            const onChange = this.props.onChange;
            if (onChange) {
                onChange(activeKey);
            }
        };
    }
    componentDidMount() {
        const NO_FLEX = ' no-flex';
        const tabNode = findDOMNode(this);
        if (tabNode && !isFlexSupported() && tabNode.className.indexOf(NO_FLEX) === -1) {
            tabNode.className += NO_FLEX;
        }
    }
    render() {
        let { prefixCls, className = '', size, type = 'line', tabPosition, children, tabBarExtraContent, tabBarStyle, hideAdd, onTabClick, onPrevClick, onNextClick, animated = true, } = this.props;
        let { inkBarAnimated, tabPaneAnimated } = typeof animated === 'object' ? {
            inkBarAnimated: animated.inkBar, tabPaneAnimated: animated.tabPane,
        } : {
            inkBarAnimated: animated, tabPaneAnimated: animated,
        };
        // card tabs should not have animation
        if (type !== 'line') {
            tabPaneAnimated = 'animated' in this.props ? tabPaneAnimated : false;
        }
        warning(!(type.indexOf('card') >= 0 && size === 'small'), 'Tabs[type=card|editable-card] doesn\'t have small size, it\'s by designed.');
        let cls = classNames(className, {
            [`${prefixCls}-mini`]: size === 'small' || size === 'mini',
            [`${prefixCls}-vertical`]: tabPosition === 'left' || tabPosition === 'right',
            [`${prefixCls}-card`]: type.indexOf('card') >= 0,
            [`${prefixCls}-${type}`]: true,
            [`${prefixCls}-no-animation`]: !tabPaneAnimated,
        });
        // only card type tabs can be added and closed
        let childrenWithClose;
        if (type === 'editable-card') {
            childrenWithClose = [];
            React.Children.forEach(children, (child, index) => {
                let closable = child.props.closable;
                closable = typeof closable === 'undefined' ? true : closable;
                const closeIcon = closable ? (React.createElement(Icon, { type: "close", onClick: e => this.removeTab(child.key, e) })) : null;
                childrenWithClose.push(cloneElement(child, {
                    tab: (React.createElement("div", { className: closable ? undefined : `${prefixCls}-tab-unclosable` },
                        child.props.tab,
                        closeIcon)),
                    key: child.key || index,
                }));
            });
            // Add new tab handler
            if (!hideAdd) {
                tabBarExtraContent = (React.createElement("span", null,
                    React.createElement(Icon, { type: "plus", className: `${prefixCls}-new-tab`, onClick: this.createNewTab }),
                    tabBarExtraContent));
            }
        }
        tabBarExtraContent = tabBarExtraContent ? (React.createElement("div", { className: `${prefixCls}-extra-content` }, tabBarExtraContent)) : null;
        const renderTabBar = () => (React.createElement(ScrollableInkTabBar, { inkBarAnimated: inkBarAnimated, extraContent: tabBarExtraContent, onTabClick: onTabClick, onPrevClick: onPrevClick, onNextClick: onNextClick, style: tabBarStyle }));
        return (React.createElement(RcTabs, Object.assign({}, this.props, { className: cls, tabBarPosition: tabPosition, renderTabBar: renderTabBar, renderTabContent: () => React.createElement(TabContent, { animated: tabPaneAnimated, animatedWithMargin: true }), onChange: this.handleChange }), childrenWithClose || children));
    }
}
Tabs.TabPane = TabPane;
Tabs.defaultProps = {
    prefixCls: 'ant-tabs',
    hideAdd: false,
};
