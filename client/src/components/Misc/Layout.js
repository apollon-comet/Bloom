import React, {Component} from 'react';
import {Menu} from "./";
import {Container} from "@dreesq/sigma";

export default class Layout extends Component {
    render() {
        const {children} = this.props;

        return (
            <>
                <Menu/>
                <Container>
                    {children}
                </Container>
            </>
        );
    }
}
