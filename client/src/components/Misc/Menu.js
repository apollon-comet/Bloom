import React, {Component} from 'react';
import client from '../../client';
import {acronym} from "../../utils";
import {withRouter} from "react-router-dom";
import {NavLink, Link} from "react-router-dom";
import {Menu as MenuIcon} from "styled-icons/boxicons-regular/Menu";
import Context from "./Context";
import {
    Nav,
    Dropdown,
    Text,
    Card,
    Container,
    Row,
    Col,
    Button,
    Sigma as S
} from "@dreesq/sigma";

class Menu extends Component {
    state = {
        open: false
    }

    logout = async () => {
        const {history} = this.props;
        await client.auth.logout();
        history.push('/auth');
    };

    render() {
        const {open} = this.state;
        const {features} = client;

        return (
            <Nav color="light" light expand="md" css={`
               .active {
                color: #0490ff;
               }
            `}>
                <Context.Consumer>
                    {
                        ({user}) => (
                            <Container>
                                <Row>
                                    <Col d={'flex'} alignItems={'center'}>
                                        <Button onClick={e => this.setState({open: true})} smUp={'display: none;'} inverted size={'small'} mr={10} p={5}>
                                            <MenuIcon color={'#0490f'} size={24}/>
                                        </Button>
                                        <Link to={'/admin'}>
                                            <Text as={'h1'} fontSize={29} color={'#0490ff'} fontWeight={'400'}>b</Text>
                                        </Link>
                                        <S ml={30} d={{smUp: 'flex', xs: open ? 'block' : 'none'}} alignItems={'center'} xs={`
                                            background: white;
                                            position: fixed;
                                            width: 100%;
                                            left: 0;
                                            margin: 0;
                                            z-index: 2;
                                            height: 100vh;
                                            top: 0;
                                            padding: 20px;
                                        `}>
                                            <S
                                                dangerouslySetInnerHTML={{__html: '&times'}}
                                                c={'#c7c4c4'}
                                                fontSize={52}
                                                textAlign={'right'}
                                                cursor={'pointer'}
                                                d={{smUp: 'none'}}
                                                mt={-21}
                                                onClick={e => this.setState({open: false})}
                                            />
                                            <S mr={20} mt={{xs: 40}}>
                                                <NavLink to="/admin" activeClassName="active" exact>Dashboard</NavLink>
                                            </S>
                                            <Dropdown>
                                                {
                                                    open => (
                                                        <>
                                                            <Text cursor={'pointer'} mr={20} d={'flex'} alignItems={'center'}>
                                                                Users
                                                                <S ml={5} dangerouslySetInnerHTML={{__html: open ? '&#9652;' : '&#9662;'}} />
                                                            </Text>
                                                            <Card width={170} p={[25, 30]} mt={-5}>
                                                                <S mb={12} cursor={'pointer'} hover={'a { color: #7b7b7b; }'}>
                                                                    <NavLink to={'/admin/users'} activeClassName="active">Users</NavLink>
                                                                </S>
                                                                <S mb={12} cursor={'pointer'} hover={'a { color: #7b7b7b; }'}>
                                                                    <NavLink to={'/admin/roles'} activeClassName="active">Roles</NavLink>
                                                                </S>
                                                                <S cursor={'pointer'} hover={'a { color: #7b7b7b; }'}>
                                                                    <NavLink to={'/admin/permissions'} activeClassName="active">Permissions</NavLink>
                                                                </S>
                                                            </Card>
                                                        </>
                                                    )
                                                }
                                            </Dropdown>
                                            {features.translations && <NavLink to="/admin/translations" activeClassName="active" exact>Translations</NavLink>}
                                        </S>
                                        <S ml={'auto'}>
                                            <Dropdown>
                                                {
                                                    open => (
                                                        <>
                                                            <S d={'flex'} alignItems={'center'} cursor={'pointer'}>
                                                                <S
                                                                    width={36}
                                                                    height={36}
                                                                    mr={6}
                                                                    borderRadius={'50%'}
                                                                    background={'#0490ff'}
                                                                    color={'#fff'}
                                                                    d={'flex'}
                                                                    alignItems={'center'}
                                                                    justifyContent={'center'}
                                                                >
                                                                    {acronym(user.name)}
                                                                </S>
                                                                {user.name}
                                                                <S ml={5} dangerouslySetInnerHTML={{__html: open ? '&#9652;' : '&#9662;'}} />
                                                            </S>
                                                            <Card width={170} p={[25, 30]} mt={4}>
                                                                <S mb={12} cursor={'pointer'} hover={'a { color: #7b7b7b; }'}>
                                                                    <Link to={'/user/settings'}>Settings</Link>
                                                                </S>
                                                                <S onClick={this.logout} cursor={'pointer'} hover={'color: #7b7b7b;'}>
                                                                    Logout
                                                                </S>
                                                            </Card>
                                                        </>
                                                    )
                                                }
                                            </Dropdown>
                                        </S>
                                    </Col>
                                </Row>
                            </Container>
                        )
                    }
                </Context.Consumer>
            </Nav>
        );
    }
}

export default withRouter(Menu);
