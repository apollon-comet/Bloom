import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Sigma as S } from '@dreesq/sigma';

export default class App extends Component {
    render() {
        const {user} = this.props;

        return (
            <S css={`
              width: 300px;
              height: 200px;
              position: absolute;
              top: 50%;
              left: 50%;
              margin-top: -100px;
              margin-left: -150px;

            `}>
                <h1>Welcome {user.name},</h1>
                <Link to={'/admin'}>Navigate to Admin Panel</Link>
            </S>
        );
    }
}
