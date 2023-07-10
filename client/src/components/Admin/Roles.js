import React, {Component} from 'react';
import {Layout} from "../Misc";
import {AutoCrud, Row, Sigma as S} from "@dreesq/sigma";

export default class Roles extends Component {
    renderInfo = row => (
        <S>
            <S fontWeight={'600'}>{row.name}</S>
            <small>{row._id}</small>
        </S>
    );

    render() {
        return (
            <Layout>
                <Row>
                    <AutoCrud
                        w={'100%'}
                        mt={30}
                        title={'Roles'}
                        collection={'Role'}
                        filters={[]}
                        fields={[
                            [null, 'Name', this.renderInfo, false]
                        ]}
                    />
                </Row>
            </Layout>
        );
    }
}
