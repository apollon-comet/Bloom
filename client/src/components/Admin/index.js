import React, {Component} from 'react';
import Layout from "../Misc/Layout";
import PropTypes from 'prop-types';
import moment from 'moment';
import {Text, Tag, Sigma as S, AutoFilter, Col, Card, Row} from "@dreesq/sigma";
import {colorize} from "../../utils";

export default class Admin extends Component {
    static contextTypes = {
        client: PropTypes.object
    };

    state = {
        stats: {}
    };

    async componentDidMount() {
        const {client} = this.context;
        const {data: stats} = await client.getStats();

        this.setState({
            stats
        });
    }

    renderLevel = level => {
        let levels = {
            error: 'danger',
            warn: 'warning',
            default: 'primary'
        };

        return (
            <Tag color={levels[level] || levels.default}>{level.toUpperCase()}</Tag>
        );
    };

    renderMessage = (msg, row) => {
        let css = `
            .key {
              color: #619bab;
            }
            
            .string {
              color: #55c149;
            }
            
            .boolean {
              color: #ff82a4;
            }
            
            .null {
              color: #ff7477;
            }
       `;

        return (
            <S maxWidth={'100%'}>
                {moment(row.timestamp).format('LLLL')}
                <S as={'pre'} wordBreak={'break-word'} whiteSpace={'pre-wrap'} bg={'#171717'} color={'#55c149'} borderRadius={4} padding={10}>
                    <S css={css} dangerouslySetInnerHTML={{__html: colorize(msg)}} />
                </S>
            </S>
        );
    };

    render() {
        const statsLoading = Object.keys(this.state.stats).length === 0;
        const {client} = this.context;
        const {stats} = this.state;

        return (
            <Layout>
                <Row mt={30}>
                    <Col width={{mdUp: '25%'}}>
                        <Card p={30} className={statsLoading ? 'loading' : ''}>
                            <Text fontWeight={'600'} m={0} mb={5}>Users</Text>
                            <Text color={'primary'} m={0} fontSize={42}>{stats.users}</Text>
                        </Card>
                    </Col>
                </Row>
                {
                    client.features.logs && (
                        <Row mt={30} mb={30}>
                            <Col width={{mdUp: '60%'}}>
                                <AutoFilter
                                    ref={ref => this.autoFilter = ref}
                                    title={'Logs'}
                                    action={'getLogs'}
                                    filters={[
                                        {
                                            name: 'level',
                                            type: 'select',
                                            label: 'Level',
                                            values: [
                                                {
                                                    value: '',
                                                    name: 'All'
                                                },
                                                {
                                                    value: 'info',
                                                    name: 'Info'
                                                },
                                                {
                                                    value: 'error',
                                                    name: 'Error'
                                                }
                                            ],
                                            props: {
                                                col: {
                                                    sm: 'width: 50%; padding-right: 5px;',
                                                    xs: 'width: 100%; padding-right: 0;'
                                                }
                                            }
                                        },
                                        {
                                            name: 'message',
                                            label: 'Message',
                                            placeholder: 'Message',
                                            props: {
                                                col: {
                                                    sm: 'width: 50%; padding-left: 5px;',
                                                    xs: 'width: 100%; padding-left: 0;'
                                                }
                                            }
                                        }
                                    ]}
                                    withPagination
                                    fields={[
                                        ['label', 'App', label => label === 'label' ? 'N/A' : label, true],
                                        ['level', 'Level', this.renderLevel, true],
                                        ['message', 'Message', this.renderMessage, false]
                                    ]}
                                    props={{
                                        table: {
                                            css: `
                                              tr {
                                                vertical-align: text-top;
                                              }
                                            `
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    )
                }
            </Layout>
        );
    }
}
