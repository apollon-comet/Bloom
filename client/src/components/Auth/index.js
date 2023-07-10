import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import client from '../../client';
import {parse} from "../../utils";
import {withRouter} from 'react-router-dom';
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

class Auth extends Component {
    state = {
        loading: false
    };

    login = async (e, provider = 'local') => {
        let parsed = {};

        if (provider === 'local') {
            parsed = parse(e);
        } else {
            parsed = {
                accessToken: e.accessToken
            };
        }

        this.loading(true);

        const {errors} = await client.auth.login({
            ...parsed,
            provider,
            refresh: 0
        });

        this.loading(false);

        if (errors) {
            return;
        }

        const {history} = this.props;
        history.push('/');
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
                        <Text as={'h1'} mt={120}>Sign In</Text>
                        <p>Don't have an account? <Link to={'/auth/register'}>Create one</Link></p>
                    </S>
                    <ActionAlert actions={['login']} renderSuccess={false}/>
                    <Form onSubmit={this.login}>
                        <Group>
                            <Label>Email</Label>
                            <Input type={'email'} name={'email'} autoFocus={true} placeholder={'me@email.com'}/>
                        </Group>
                        <Group>
                            <Label>Password</Label>
                            <Input type={'password'} name={'password'} placeholder={'Password'}/>
                        </Group>
                        <S textAlign={'right'}>
                            <Link to={'auth/reset'}>Forgot password?</Link>
                        </S>
                        <Button color={'primary'} disabled={loading} mt={20} block>
                            Login
                        </Button>
                    </Form>
                </Col>
            </Container>
        );
    }
}

export default withRouter(Auth);
