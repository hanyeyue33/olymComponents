import React from 'react';
import RcUpload from 'rc-upload';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import UploadList from './UploadList';
import { T, fileToObject, genPercentAdd, getFileItem, removeFileItem } from './utils';
const defaultLocale = {
    uploading: '文件上传中',
    removeFile: '删除文件',
    uploadError: '上传错误',
    previewFile: '预览文件',
};
export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.onStart = (file) => {
            let targetItem;
            let nextFileList = this.state.fileList.concat();
            if (file.length > 0) {
                targetItem = file.map(f => {
                    const fileObject = fileToObject(f);
                    fileObject.status = 'uploading';
                    return fileObject;
                });
                nextFileList = nextFileList.concat(targetItem);
            }
            else {
                targetItem = fileToObject(file);
                targetItem.status = 'uploading';
                nextFileList.push(targetItem);
            }
            this.onChange({
                file: targetItem,
                fileList: nextFileList,
            });
            // fix ie progress
            if (!window.FormData) {
                this.autoUpdateProgress(0, targetItem);
            }
        };
        this.onSuccess = (response, file) => {
            this.clearProgressTimer();
            try {
                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }
            }
            catch (e) {
            }
            let fileList = this.state.fileList;
            let targetItem = getFileItem(file, fileList);
            // removed
            if (!targetItem) {
                return;
            }
            targetItem.status = 'done';
            targetItem.response = response;
            this.onChange({
                file: Object.assign({}, targetItem),
                fileList,
            });
        };
        this.onProgress = (e, file) => {
            let fileList = this.state.fileList;
            let targetItem = getFileItem(file, fileList);
            // removed
            if (!targetItem) {
                return;
            }
            targetItem.percent = e.percent;
            this.onChange({
                event: e,
                file: Object.assign({}, targetItem),
                fileList: this.state.fileList,
            });
        };
        this.onError = (error, response, file) => {
            this.clearProgressTimer();
            let fileList = this.state.fileList;
            let targetItem = getFileItem(file, fileList);
            // removed
            if (!targetItem) {
                return;
            }
            targetItem.error = error;
            targetItem.response = response;
            targetItem.status = 'error';
            this.onChange({
                file: Object.assign({}, targetItem),
                fileList,
            });
        };
        this.handleManualRemove = (file) => {
            this.refs.upload.abort(file);
            file.status = 'removed'; // eslint-disable-line
            this.handleRemove(file);
        };
        this.onChange = (info) => {
            if (!('fileList' in this.props)) {
                this.setState({ fileList: info.fileList });
            }
            const { onChange } = this.props;
            if (onChange) {
                onChange(info);
            }
        };
        this.onFileDrop = (e) => {
            this.setState({
                dragState: e.type,
            });
        };
        this.beforeUpload = (file, fileList) => {
            if (!this.props.beforeUpload) {
                return true;
            }
            const result = this.props.beforeUpload(file, fileList);
            if (result === false) {
                this.onChange({
                    file,
                    fileList,
                });
                return false;
            }
            else if (result && result.then) {
                return result;
            }
            return true;
        };
        this.state = {
            fileList: this.props.fileList || this.props.defaultFileList || [],
            dragState: 'drop',
        };
    }
    componentWillUnmount() {
        this.clearProgressTimer();
    }
    getLocale() {
        let locale = {};
        if (this.context.antLocale && this.context.antLocale.Upload) {
            locale = this.context.antLocale.Upload;
        }
        return Object.assign({}, defaultLocale, locale, this.props.locale);
    }
    autoUpdateProgress(_, file) {
        const getPercent = genPercentAdd();
        let curPercent = 0;
        this.clearProgressTimer();
        this.progressTimer = setInterval(() => {
            curPercent = getPercent(curPercent);
            this.onProgress({
                percent: curPercent,
            }, file);
        }, 200);
    }
    handleRemove(file) {
        const { onRemove } = this.props;
        Promise.resolve(typeof onRemove === 'function' ? onRemove(file) : onRemove).then(ret => {
            // Prevent removing file
            if (ret === false) {
                return;
            }
            const removedFileList = removeFileItem(file, this.state.fileList);
            if (removedFileList) {
                this.onChange({
                    file,
                    fileList: removedFileList,
                });
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        if ('fileList' in nextProps) {
            this.setState({
                fileList: nextProps.fileList || [],
            });
        }
    }
    clearProgressTimer() {
        clearInterval(this.progressTimer);
    }
    render() {
        const { prefixCls = '', showUploadList, listType, onPreview, type, disabled, children, className, } = this.props;
        const rcUploadProps = Object.assign({ onStart: this.onStart, onError: this.onError, onProgress: this.onProgress, onSuccess: this.onSuccess }, this.props, { beforeUpload: this.beforeUpload });
        delete rcUploadProps.className;
        const { showRemoveIcon, showPreviewIcon } = showUploadList;
        const uploadList = showUploadList ? (React.createElement(UploadList, { listType: listType, items: this.state.fileList, onPreview: onPreview, onRemove: this.handleManualRemove, showRemoveIcon: showRemoveIcon, showPreviewIcon: showPreviewIcon, locale: this.getLocale() })) : null;
        if (type === 'drag') {
            const dragCls = classNames(prefixCls, {
                [`${prefixCls}-drag`]: true,
                [`${prefixCls}-drag-uploading`]: this.state.fileList.some(file => file.status === 'uploading'),
                [`${prefixCls}-drag-hover`]: this.state.dragState === 'dragover',
                [`${prefixCls}-disabled`]: disabled,
            });
            return (React.createElement("span", { className: className },
                React.createElement("div", { className: dragCls, onDrop: this.onFileDrop, onDragOver: this.onFileDrop, onDragLeave: this.onFileDrop },
                    React.createElement(RcUpload, Object.assign({}, rcUploadProps, { ref: "upload", className: `${prefixCls}-btn` }),
                        React.createElement("div", { className: `${prefixCls}-drag-container` }, children))),
                uploadList));
        }
        const uploadButtonCls = classNames(prefixCls, {
            [`${prefixCls}-select`]: true,
            [`${prefixCls}-select-${listType}`]: true,
            [`${prefixCls}-disabled`]: disabled,
        });
        const uploadButton = (React.createElement("div", { className: uploadButtonCls, style: { display: children ? '' : 'none' } },
            React.createElement(RcUpload, Object.assign({}, rcUploadProps, { ref: "upload" }))));
        if (listType === 'picture-card') {
            return (React.createElement("span", { className: className },
                uploadList,
                uploadButton));
        }
        return (React.createElement("span", { className: className },
            uploadButton,
            uploadList));
    }
}
Upload.defaultProps = {
    prefixCls: 'ant-upload',
    type: 'select',
    multiple: false,
    action: '',
    data: {},
    accept: '',
    beforeUpload: T,
    showUploadList: true,
    listType: 'text',
    className: '',
    disabled: false,
    supportServerRender: true,
};
Upload.contextTypes = {
    antLocale: PropTypes.object,
};
