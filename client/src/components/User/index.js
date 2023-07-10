import React, {Component} from 'react';
import Layout from '../Misc/Layout';
import {ActionForm, Text, Row, Col, Card} from "@dreesq/sigma";

export default class User extends Component {
    render() {
        const {updateUser, user} = this.props;

        return (
            <Layout>
                <h1>Settings</h1>
                <Row>
                    <Col width={'50%'}>
                        <Card mb={19}>
                            <Text as={'h3'}>Account</Text>
                            <ActionForm
                                withAlert
                                focusFirst
                                action={'setName'}
                                handleText={'Save'}
                                props={{
                                    handle: {
                                        ml: 'auto'
                                    }
                                }}
                                onSuccess={data => updateUser({...user, name: data.name})}
                            />
                        </Card>
                        <Card>
                            <Text as={'h3'}>Credentials</Text>
                            <ActionForm
                                withAlert
                                focusFirst
                                action={'setPassword'}
                                handleText={'Save'}
                                props={{
                                    handle: {
                                        ml: 'auto'
                                    }
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Layout>
        );
    }
}
