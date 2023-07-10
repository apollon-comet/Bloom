import React, {Component} from 'react';
import {Layout} from "../Misc";
import {
    ActionAlert,
    ActionForm,
    ConfirmModal,
    Pagination,
    Tag,
    Input,
    Table,
    Card,
    Col,
    Text,
    Button,
    Row,
    Modal,
    Sigma as S
} from "@dreesq/sigma";

export default class Translations extends Component {
    state = {
        items: [],
        locales: [],
        form: Translations.getFormBase(),
        loading: true,
        pagination: {},
        filters: {}
    };

    static contextTypes = {
        client: () => null
    };

    static getFormBase() {
        return {
            key: '',
            app: '',
            locale: '',
            content: ''
        }
    }

    create = () => {
        this.setState({
            form: Translations.getFormBase()
        }, () => {
            this.createModal.toggle();
        });
    }

    delete = async key => {
        const {client} = this.context;
        const {items} = this.state;

        this.setState({
            loading: true
        });

        const input = {
            key: items[key].key,
            locale: items[key].locale
        };

        if (items[key].app) {
            input.app = items[key].app;
        }

        const {errors} = await client.unsetTranslation(input);

        if (errors) {
            return;
        }

        await this.load();
    };

    async componentDidMount() {
        await this.load();
    }

    load = async (page = 1, filters = {}) => {
        const {client} = this.context;

        this.setState({
            loading: true
        });

        const {data, errors} = await client.filterTranslations({
            page,
            filters
        });

        if (errors) {
            return;
        }

        this.setState({
            items: data.data,
            locales: data.locales,
            pagination: data.pagination,
            loading: false,
            filters
        })
    }

    onChange = (key, e) => {
        const {items} = this.state;
        const {value} = e.target;

        items[key].content = value;
        items[key].changed = true;

        this.setState({
            items
        });
    };

    save = async key => {
        const {client} = this.context;
        const {items} = this.state;

        items[key].loading = true;

        this.setState({
            items
        });

        const input = {
            key: items[key].key,
            locale: items[key].locale,
            content: items[key].content
        };

        if (items[key].app) {
            input.app = items[key].app;
        }

        await client.setTranslation(input);
        items[key].loading = false;
        items[key].changed = false;
        this.setState({
            items
        });
    };

    onCancel = e => {
        this.createModal.toggle(false);
    };

    onCreated = async e => {
        await this.load();
        this.createModal.toggle(false);
    };

    onSearch = e => {
        const {value} = e.target;

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(async () => {
            await this.load(1, {
                search: value
            });
        }, 300);
    };

    onPageChange = async page => {
        const {filters} = this.state;
        await this.load(page, filters);
    };

    render() {
        const {items, loading, pagination} = this.state;

        return (
            <Layout>
                <Modal ref={ref => this.createModal = ref} width={450}>
                    <h3>Create Translation</h3>
                    <ActionForm
                        focusFirst
                        props={{
                            cancel: {
                                ml: 'auto'
                            }
                        }}
                        onSuccess={this.onCreated}
                        handleText={'Save'}
                        action={'setTranslation'}
                        onCancel={this.onCancel}/>
                </Modal>
                <ConfirmModal ref={ref => this.confirm = ref} />
                <Row mt={30}>
                    <Col d={'flex'} alignItems={'center'}>
                        <Text as={'h3'} fontSize={28} m={0}>Translations</Text>
                        <S ml={'auto'} d={'flex'} alignItems={'centers'}>
                            <Input placeholder={'Search'} container={{mr: 10}} onChange={this.onSearch}/>
                            <Button onClick={e => this.create()}>Create</Button>
                        </S>
                    </Col>
                    <Col>
                        <ActionAlert
                            actions={['setTranslation', 'unsetTranslation']}
                            renderSuccess={() => 'Translation successfully updated'}
                            mt={10}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {
                            !loading && !items.length && (
                                <S textAlign={'center'} mt={120}>
                                    <h1>No translations</h1>
                                    <p>There are no translations to show</p>
                                    <Button onClick={e => this.createModal.toggle()}>Create</Button>
                                </S>
                            )
                        }
                        {
                            !loading && !!items.length && (
                                <Card mt={20}>
                                    <Table
                                        mdDown={`
                                            thead {
                                                display: none;
                                            }
                                        
                                            td {
                                                display: block;
                                            }
                                        `}
                                    >
                                        <thead>
                                            <tr>
                                                <th>App</th>
                                                <th>
                                                    <S width={100} as={'span'}>
                                                        Locale
                                                    </S>
                                                </th>
                                                <th>Key</th>
                                                <th>
                                                    <S width={420} as={'span'}>
                                                        Content
                                                    </S>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            items.map((item, index) => {
                                                return (
                                                    <tr style={{verticalAlign: 'top'}} key={index}>
                                                        <td>
                                                            {item.app || 'N/A'}
                                                        </td>
                                                        <td style={{width: 140}}>
                                                            {item.locale.toUpperCase()}
                                                        </td>
                                                        <td>
                                                            <Tag>
                                                                {item.key}
                                                            </Tag>
                                                        </td>
                                                        <td>
                                                            <S d={'flex'} flexWrap={'wrap'}>
                                                                <Input as={'textarea'} minHeight={43} container={{w: '100%'}} onChange={e => this.onChange(index, e)} value={item.content}/>

                                                                <S d={'flex'} mt={10} w={'100%'}>
                                                                    <Button color={'danger'} ml={'auto'} onClick={e => this.confirm.confirm(() => this.delete(index))}>Delete</Button>
                                                                    {item.changed && <Button loading={item.loading} ml={5} onClick={e => this.save(index)}>Save</Button>}
                                                                </S>
                                                            </S>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                        </tbody>
                                    </Table>
                                    {pagination.pages > 1 && <Pagination currentPage={pagination.page} totalPages={pagination.pages} onChange={this.onPageChange}/>}
                                </Card>
                            )
                        }
                    </Col>
                </Row>
            </Layout>
        );
    }
}
