import React, {Component, Fragment} from 'react';
import {capitalize} from "../../utils";

export default class Alert extends Component {
    state = {
        errors: false
    };

    toggle = (errors = false) => {
        this.setState({
            errors
        });
    };

    render() {
        const {errors} = this.state;

        return (
            <div color="danger" isOpen={!!errors} toggle={e => this.toggle(false)}>
                {
                    Object.keys(errors).map((key, index) => (
                        <Fragment key={index}>
                            <ul>
                                {capitalize(key)}:
                                {
                                    (Array.isArray(errors[key]) ? errors[key] : [errors[key]]).map((error, subIndex) => (
                                        <li key={subIndex}>{typeof error !== 'string' ? JSON.stringify(error, null, 4) : error}</li>
                                    ))
                                }
                            </ul>
                        </Fragment>
                    ))
                }
            </div>
        );
    }
}