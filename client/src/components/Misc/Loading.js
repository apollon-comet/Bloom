import React, {Component} from 'react';

export default class Loading extends Component {
    render() {
        const {loading} = this.props;

        if (!loading) {
            return null;
        }

        return (
            <div className={'loading'}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    }
}