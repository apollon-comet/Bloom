import React, {Component} from 'react';
import client from "../../client";
import {Link, withRouter} from "react-router-dom";
import {parseQs} from "../../utils";
import PropTypes from 'prop-types';
import {
    ActionAlert,
    Sigma as S,
    Text,
    Container,
    Col
} from "@dreesq/sigma";

class Confirm extends Component {
    state = {
        loading: false,
        finished: false
    };

    static contextTypes = {
        client: PropTypes.object
    };

    async componentDidMount() {
        const qs = parseQs(this.props.location.search);

        const {data, errors} = await client.confirmUser({
            token: qs.token
        });

        this.loading(false);

        if (errors) {
            return this.alert.toggle(errors);
        }

        if (data.success) {
            this.setState({
                finished: true
            });
        }
    }

    loading = (loading = true) => {
        this.setState({ loading });
    };

    render() {
        const {loading, finished} = this.state;

        return (
            <Container>
                <Col
                    maxWidth={450}
                    m={[0, 'auto']}
                >
                    <S textAlign={'center'}>
                        <Text as={'h1'} mt={120}>Confirm Account</Text>
                    </S>
                    <ActionAlert actions={['confirmUser']}/>
                    {
                        loading && (
                            <Text className={'text-warning'} color={'primary'}>Hold on while we confirm your account.</Text>
                        )
                    }
                    {
                        finished && (
                            <Text className={'text-success'} color={'success'}>Account was successfully confirmed. <br/><Link
                                to={'/'}>Navigate to dashboard</Link></Text>
                        )
                    }
                </Col>
            </Container>
        );
    }
}

export default withRouter(Confirm);
