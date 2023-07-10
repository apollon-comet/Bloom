import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {parse} from '../../utils';
import PropTypes from 'prop-types';
import {
    Button,
    Col,
    Container,
    Input,
    Form,
    Group,
    Label,
    Text,
    Sigma as S,
    ActionAlert
} from "@dreesq/sigma";

class Register extends Component {
    state = {
        loading: false,
        errors: {}
    };

    static contextTypes = {
        client: PropTypes.object
    };

    register = async e => {
        const {client} = this.context;
        const parsed = parse(e);
        this.loading(true);

        const {errors} = await client.createUser({
            ...parsed,
            provider: 'local'
        });

        this.loading(false);

        if (errors) {
            return;
        }

        const {errors: authErrors} = await client.auth.login({
            ...parsed,
            provider: 'local'
        });

        if (authErrors) {
            return;
        }

        const {history} = this.props;
        history.push('/admin');
    };

    loading = (loading = true) => {
        this.setState({ loading });
    };

    render() {
        const {loading} = this.state;

        return (
            <Container>
                <Col
                    maxWidth={450}
                    m={[0, 'auto']}
                >
                    <S textAlign={'center'}>
                        <Text as={'h1'} mt={120}>Sign Up</Text>
                        <p>Already have an account? <Link to={'/auth'}>Sign in</Link> instead</p>
                    </S>
                    <ActionAlert actions={['createUser', 'login']}/>
                    <Form onSubmit={this.register}>
                        <Group>
                            <Label>Name</Label>
                            <Input type={'text'} name={'name'} autoFocus placeholder={'Name'}/>
                        </Group>
                        <Group>
                            <Label>Email</Label>
                            <Input type={'email'} name={'email'} placeholder={'me@email.com'}/>
                        </Group>
                        <Group>
                            <Label>Password</Label>
                            <Input type={'password'} name={'password'} placeholder={'Password'}/>
                        </Group>
                        <Button block color={'primary'} disabled={loading}>
                            Register
                        </Button>
                    </Form>
                </Col>
            </Container>
        );
    }
}

export default withRouter(Register);
