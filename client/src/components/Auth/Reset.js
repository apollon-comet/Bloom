import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {parse, parseQs} from '../../utils';
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

class Reset extends Component {
    state = {
        loading: false,
        token: '',
        step: 0,
        finished: false
    };

    static contextTypes = {
        client: PropTypes.object
    };

    componentDidMount() {
        const qs = parseQs(this.props.location.search);

        if (qs.token) {
            this.setState({
                token: qs.token,
                step: 1
            });
        }
    }

    reset = async e => {
        const {client} = this.context;
        const {step, token} = this.state;
        const parsed = parse(e);
        this.loading(true);

        const opts = {
            ...parsed,
            action: step === 0 ? 0 : 1
        };

        if (step === 1) {
            opts.token = token;
        }

        const {data, errors} = await client.resetPassword(opts);

        this.loading(false);

        if (errors) {
            return;
        }

        if (data.success) {
            this.setState({
                finished: true
            });
        }
    };

    loading = (loading = true) => {
        this.setState({ loading });
    };

    render() {
        const {loading, step, finished} = this.state;

        return (
            <Container>
                <Col
                    maxWidth={450}
                    m={[0, 'auto']}
                >
                    <div className={'p-4 mt-5'}>
                        <S textAlign={'center'}>
                            <Text as={'h1'} mt={120}>Recover</Text>
                            <p>Don't have an account? <Link to={'/auth/register'}>Sign up</Link> instead</p>
                        </S>
                        <ActionAlert actions={['resetPassword']}/>
                        {
                            finished && (
                                <Fragment>
                                    {
                                        step === 0 && (
                                            <p className={'text-success'}>An email containing the reset url was sent to the given email.</p>
                                        )
                                    }
                                    {
                                        step === 1 && (
                                            <p className={'text-success'}>Account password was successfully changed. You may <Link to={'/auth'}><u>login</u></Link> now.</p>
                                        )
                                    }
                                </Fragment>
                            )
                        }
                        {
                            !finished && (
                                <div lg={12}>
                                    <Form onSubmit={this.reset}>
                                        {
                                            step === 0 && (
                                                <Group>
                                                    <Label>Email</Label>
                                                    <Input type={'email'} name={'email'} autoFocus={true} placeholder={'Email'}/>
                                                </Group>
                                            )
                                        }
                                        {
                                            step === 1 && (
                                                <Fragment>
                                                    <Group>
                                                        <Label>Password</Label>
                                                        <Input type={'password'} name={'password'} autoFocus={true} placeholder={'Password'}/>
                                                    </Group>
                                                    <Group>
                                                        <Label>Repeat Password</Label>
                                                        <Input type={'password'} name={'repeatPassword'} placeholder={'Repeat Password'}/>
                                                    </Group>
                                                </Fragment>
                                            )
                                        }
                                        <Button block color={'primary'} disabled={loading}>
                                            Submit
                                        </Button>
                                    </Form>
                                </div>
                            )
                        }
                    </div>
                </Col>
            </Container>
        );
    }
}

export default withRouter(Reset);


