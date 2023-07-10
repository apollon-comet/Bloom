import React, {Component} from 'react';

export default class Modal extends Component {
    state = {
        open: false
    };

    toggle = open => {
        this.setState({
            open: typeof open === 'boolean' ? open : !open
        });
    };

    render() {
        const {open} = this.state;
        const {children, title, onAction, onCancel, actionText = 'Handle', actionColor = 'primary'} = this.props;

        return (
            <div isOpen={open} toggle={onCancel ? onCancel : this.toggle}>
                <div toggle={this.toggle}>{title}</div>
                <div>
                    {children}
                </div>
                <div>
                    <button color={actionColor} onClick={onAction}>{actionText}</button>{' '}
                    <button color="secondary" onClick={onCancel ? onCancel : this.toggle}>Cancel</button>
                </div>
            </div>
        );
    }
}