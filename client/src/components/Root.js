import React, {Component} from 'react';
import {Base, Context} from '@dreesq/sigma';
import {
    BrowserRouter,
    Route,
    Switch
} from 'react-router-dom';

import client from '../client';
import Async from './Misc/Async';
import Guard from './Misc/Guard';

const AuthRoute = ({path, component, exact = false, role}) => (
    <Route
        path={path}
        exact={exact}
        component={Guard(
            Async(component),
    {
                redirectFailed: '/auth',
                ...(role ? { role } : {})
            }
        )}
    />
);

class Router extends Component {
    static contextTypes = {
        client: () => null
    };

    state = {
        loading: true
    };

    async componentDidMount() {
        const {client} = this.context;
        const {errors, data} = await client.getFeatures();

        let features = {};

        if (!errors) {
            features = data;
        }

        client.features = features;
        this.setState({
            loading: false
        });
    }

    render() {
        const {loading} = this.state;

        if (loading) {
            return null;
        }

        return (
            <BrowserRouter>
                <Switch>
                    {/* =========== App ============== */}
                    <AuthRoute path={'/'} exact component={'App'} />

                    {/* ========== Admin =========== */}
                    <AuthRoute path={'/admin'} exact component={'Admin'} role={'admin'}/>
                    <AuthRoute path={'/admin/users'} component={'Admin/Users'} role={'admin'}/>
                    <AuthRoute path={'/admin/roles'} component={'Admin/Roles'} role={'admin'}/>
                    <AuthRoute path={'/admin/permissions'} component={'Admin/Permissions'} role={'admin'}/>
                    <AuthRoute path={'/admin/translations'} component={'Admin/Translations'} role={'admin'}/>

                    {/* ========== User =========== */}
                    <AuthRoute path={'/user/settings'} component={'User'}/>

                    {/* ========== Auth =========== */}
                    <Route path={'/auth'} exact component={Guard(Async('Auth'), {redirectSuccess: '/'})}/>
                    <Route path={`/auth/register`} exact component={Guard(Async('Auth/Register'), {redirectSuccess: '/'})}/>
                    <Route path={`/auth/reset`} exact component={Guard(Async('Auth/Reset'), {redirectSuccess: '/'})}/>
                    <Route path={'/auth/confirm'} exact component={Async('Auth/Confirm')} />

                    {/* ========== Other =========== */}
                    <Route path={`*`} component={Async('Misc/NotFound')}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default class Root extends Component {
    render() {
        return (
            <Context client={client}>
                <Base />
                <Router />
            </Context>
        );
    }
}
