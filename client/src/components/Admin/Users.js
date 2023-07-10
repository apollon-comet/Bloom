import React, {Component} from 'react';
import Layout from "../Misc/Layout";
import {Row, AutoCrud, Sigma as S, Tag} from "@dreesq/sigma";

export default class Users extends Component {
    renderInfo = (value, row) => {
        return (
            <S>
                <S fontWeight={'600'}>{row.name}</S>
                <small>{row._id}</small>
            </S>
        );
    };

    renderStatus = (value, row) => {
        let color = 'primary';

        if (row.status === 0) {
            color = 'warning';
        } else if (row.status === 1) {
            color = 'success';
        }

        return (
            <Tag color={color}>{row.statusName}</Tag>
        )
    }

    renderPermissions = (permissions = []) => {
        if (!permissions.length) {
            return 'N/A';
        }

        return permissions.map((permission, key) => (
            <Tag color={'primary'} key={key} m={3} ml={key === 0 ? 0 : 3}>{permission.name}</Tag>
        ))
    }

    render() {
        const filters = [
            {
                name: 'name',
                label: 'Name'
            }
        ];

        return (
            <Layout>
                <Row>
                    <AutoCrud
                        w={'100%'}
                        mt={30}
                        title={'Users'}
                        collection={'User'}
                        filters={filters}
                        modalWidth={620}
                        fields={[
                            ['name', 'Name', this.renderInfo, true],
                            ['role', 'Role', role => role ? role.name : 'N/A', true],
                            ['permissions', 'Permissions', this.renderPermissions],
                            ['locale', 'Locale', locale => locale ? locale.toUpperCase() : 'N/A', true],
                            ['status', 'Status', this.renderStatus, true]
                        ]}
                    />
                </Row>
            </Layout>
        );
    }
}
