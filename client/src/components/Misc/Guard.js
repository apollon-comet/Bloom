import React, {Component} from 'react';
import Context from './Context';
import PropTypes from 'prop-types';

/**
 * HoC handling route guard
 * @param WrappedComponent
 * @param options
 * @returns {{new(): {state, componentDidMount(), render(): *}, prototype: {state, componentDidMount(), render(): *}}}
 */

export default (WrappedComponent, options = {}) => {
    return class extends Component {
        state = {
            loading: true,
            user: false
        };

        static contextTypes = {
            router: PropTypes.object,
            client: PropTypes.object.isRequired
        };

        updateUser = (user) => {
            this.setState({
                user
            });
        };

        async componentDidMount() {
            const {client} = this.context;
            const {history} = this.props;

            const opts = {
                loading: false
            };

            try {
                const {errors} = await client.auth.getUser();

                if (errors) {
                    throw new Error();
                }

                if (options.role && !client.auth.is(options.role)) {
                    return history.push(options.redirectFailed);
                }

                if (options.redirectSuccess) {
                    history.push(options.redirectSuccess);
                }

                opts.user = client.auth.user;
            } catch(error) {
                if (options.redirectFailed && window.location.pathname !== options.redirectFailed) {
                    history.push(options.redirectFailed);
                }
            }

            this.setState(opts);
        }

        render() {
            const {user, loading} = this.state;

            if (loading) {
                return null;
            }

            return (
                <Context.Provider value={{ user, updateUser: this.updateUser }}>
                    <WrappedComponent/>
                </Context.Provider>
            );
        }
    }
};
