//eslint-disable
import React, { Component } from 'react';
import {Form, Input, Button, Row, Col, Table, InputNumber, Tooltip, Modal, Card} from 'antd';
import axios from 'axios';
import {EyeOutlined} from "@ant-design/icons";
import ViewTransactionForm from "../Transaction/Commen/ViewTransactionForm";
import Item from "./Item";

class CustomerURL extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: null,
            loading: false,
            tablePayment: [],
            isUpdateModalVisible: false,
            isViewModalVisible: false,
            selectedItem: null,
            initialValues: {},
        };
        this.getCustomerDetails();
        this.toggleViewModal = this.toggleViewModal.bind(this);
        this.handleViewShow = this.handleViewShow.bind(this);
    }
    formRef = React.createRef();

    toggleViewModal() {
        this.setState({
            isViewModalVisible: !this.state.isViewModalVisible,
            selectedItem: null,
        });
    }
    handleViewShow(row) {
        //console.log('row', row);
        this.setState({
            selectedItem: row,
            isViewModalVisible: true,
        });
        //console.log('selectedItem', this.state.selectedItem);
    }

    decodeBase64 = (text) => atob(text);

    async getCustomerDetails() {
        this.setState({ loading: true });

        const { match: { params } } = this.props;
        const { id } = params;


        try {
            //console.log('this.props.customerId', this.props);
            const decodedId = this.decodeBase64(id);
            const response = await axios.post('http://35.154.1.99:3001/getCustomerDetails', {
                CUSTOMER_ID: decodedId,
            });


            if (response.data.success) {
                const items = response.data.result;
                //console.log('items', items);
                this.setState({ initialValues: items });
                this.getCustomerTransactions();
            } else {
                //console.log('Error:', response.data.message);
            }
        } catch (error) {
            //console.log('Error:', error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    }

    async getCustomerTransactions() {
        this.setState({ loading: true });

        const { match: { params } } = this.props;
        const { id } = params;

        if(this.state.initialValues.TYPE === 'Seller'){
            try {
                const response = await axios.post('http://35.154.1.99:3001/getCustomerSellerTransactions', {
                    CUSTOMER_ID: id,
                });

                if (response.data.success) {
                    const items = response.data.result;
                    //console.log('items', items);
                    this.setState({ tablePayment: items });
                } else {
                    //console.log('Error:', response.data.message);
                }
            } catch (error) {
                //console.log('Error:', error.message);
            } finally {
                this.setState({
                    loading: false,
                });
            }
        }
        else if(this.state.initialValues.TYPE === 'Buyer'){
            try {
                const response = await axios.post('http://35.154.1.99:3001/getCustomerBuyerTransactions', {
                    CUSTOMER_ID: id,
                });

                if (response.data.success) {
                    const items = response.data.result;
                    //console.log('items', items);
                    this.setState({ tablePayment: items });
                } else {
                    //console.log('Error:', response.data.message);
                }
            } catch (error) {
                //console.log('Error:', error.message);
            } finally {
                this.setState({
                    loading: false,
                });
            }
        }
        else if(this.state.initialValues.TYPE === 'Sales Person'){
            try {
                const response = await axios.post('http://35.154.1.99:3001/getCustomerSalesPersonTransactions', {
                    CUSTOMER_ID: id,
                });

                if (response.data.success) {
                    const items = response.data.result;
                    //console.log('items', items);
                    this.setState({ tablePayment: items });
                } else {
                    //console.log('Error:', response.data.message);
                }
            } catch (error) {
                //console.log('Error:', error.message);
            } finally {
                this.setState({
                    loading: false,
                });
            }
        }
        else if(this.state.initialValues.TYPE === 'Partner'){
            try {
                const response = await axios.post('http://35.154.1.99:3001/getCustomerPartnerTransactions', {
                    CUSTOMER_ID: id,
                });

                if (response.data.success) {
                    const items = response.data.result;
                    //console.log('items', items);
                    this.setState({ tablePayment: items });
                } else {
                    //console.log('Error:', response.data.message);
                }
            } catch (error) {
                //console.log('Error:', error.message);
            } finally {
                this.setState({
                    loading: false,
                });
            }
        }
        else if(this.state.initialValues.TYPE === 'Preformer'){
            try {
                const response = await axios.post('http://35.154.1.99:3001/getCustomerPreformerTransactions', {
                    CUSTOMER_ID: id,
                });

                if (response.data.success) {
                    const items = response.data.result;
                    //console.log('items', items);
                    this.setState({ tablePayment: items });
                } else {
                    //console.log('Error:', response.data.message);
                }
            } catch (error) {
                //console.log('Error:', error.message);
            } finally {
                this.setState({
                    loading: false,
                });
            }
        }
        else if(this.state.initialValues.TYPE === 'C&P'){
            try {
                const response = await axios.post('http://35.154.1.99:3001/getCustomerCPTransactions', {
                    CUSTOMER_ID: id,
                });

                if (response.data.success) {
                    const items = response.data.result;
                    //console.log('items', items);
                    this.setState({ tablePayment: items });
                } else {
                    //console.log('Error:', response.data.message);
                }
            } catch (error) {
                //console.log('Error:', error.message);
            } finally {
                this.setState({
                    loading: false,
                });
            }
        }
        else if(this.state.initialValues.TYPE === 'Electric'){
            try {
                const response = await axios.post('http://35.154.1.99:3001/getCustomerElectricTransactions', {
                    CUSTOMER_ID: id,
                });

                if (response.data.success) {
                    const items = response.data.result;
                    //console.log('items', items);
                    this.setState({ tablePayment: items });
                } else {
                    //console.log('Error:', response.data.message);
                }
            } catch (error) {
                //console.log('Error:', error.message);
            } finally {
                this.setState({
                    loading: false,
                });
            }
        }
        else if(this.state.initialValues.TYPE === 'Heat T'){
            try {
                const response = await axios.post('http://35.154.1.99:3001/getCustomerHeatTTransactions', {
                    CUSTOMER_ID: id,
                });

                if (response.data.success) {
                    const items = response.data.result;
                    //console.log('items', items);
                    this.setState({ tablePayment: items });
                } else {
                    //console.log('Error:', response.data.message);
                }
            } catch (error) {
                //console.log('Error:', error.message);
            } finally {
                this.setState({
                    loading: false,
                });
            }
        }

    }


    render() {

        return (
            <>

                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Name: {this.state.initialValues.NAME}</span>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Phone Number: {this.state.initialValues.PHONE_NUMBER}</span>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>NIC: {this.state.initialValues.NIC}</span>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Type: {this.state.initialValues.TYPE}</span>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Company: {this.state.initialValues.COMPANY}</span>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Address: {this.state.initialValues.ADDRESS}</span>
                    </Col>
                </Row>


                <Card
                    bordered={false}
                    className="criclebox tablespace mb-24"
                    title={
                        <button
                            style={{
                                color: '#FFFFFF',
                                background: `#1890FF`,
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 16px',
                                cursor: 'default',
                            }}
                        >
                            Details
                        </button>
                    }
                >
                    <div className="table-responsive">
                        {this.state.initialValues.TYPE === 'Seller' || this.state.initialValues.TYPE === 'Buyer' ? (
                            <Table
                                className="ant-border-space"
                                size="small"
                                style={{ margin: '15px' }}
                                rowKey="TRANSACTION_ID"
                                columns={[
                                    {
                                        title: 'Transaction Code',
                                        dataIndex: 'CODE',
                                    },
                                    {
                                        title: 'Status',
                                        dataIndex: 'STATUS',
                                    },
                                    {
                                        title: 'Date',
                                        dataIndex: 'DATE',
                                        render: (row) => (
                                            <span> {new Date(row).toLocaleDateString()}</span>
                                        ),
                                    },
                                    {
                                        title: 'Reference Item',
                                        dataIndex: 'ITEM_CODE',
                                        render: (text, record) => (
                                            <Button type="default" style={{ height: 'auto' }}
                                                    onClick={() => this.showReferenceItem(record.ITEM_ID_AI)}>
                                <span>
                <div>{record.ITEM_CODE}</div>
                                </span>
                                            </Button>
                                        ),
                                    },
                                    {
                                        title: 'Initial Payment',
                                        dataIndex: 'PAYMENT_AMOUNT',
                                        render: (text, record) => {
                                            return (
                                                <InputNumber readOnly
                                                             defaultValue={text}
                                                             formatter={(value) =>
                                                                 `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                             }
                                                             parser={(value) => value.replace(/Rs.\s?|(,*)/g, '')}
                                                />
                                            );
                                        },
                                    },
                                    {
                                        title: 'Amount',
                                        dataIndex: 'AMOUNT',
                                        render: (text, record) => (
                                            <span>
                <div>Amount: Rs. {record.AMOUNT}</div>
                <div style={{ color: 'green' }}>Amount Settled: Rs. {record.AMOUNT_SETTLED}</div>
                <div style={{ color: 'red' }}>Amount Due: Rs. {record.DUE_AMOUNT}</div>
            </span>
                                        ),
                                    },
                                ]}
                                dataSource={this.state.tablePayment}
                                pagination={true}
                                loading={this.state.loading}
                                expandedRowRender={(record) => (
                                    record.PAYMENTS && record.PAYMENTS.length > 0 ? (
                                        <Table
                                            size="small"
                                            rowKey="TRANSACTION_ID"
                                            columns={[
                                                {
                                                    title: 'Transaction Code',
                                                    dataIndex: 'CODE',
                                                },
                                                {
                                                    title: 'Status',
                                                    dataIndex: 'STATUS',
                                                },
                                                {
                                                    title: 'Date',
                                                    dataIndex: 'DATE',
                                                    render: (row) => (
                                                        <span> {new Date(row).toLocaleDateString()}</span>
                                                    ),
                                                },
                                                {
                                                    title: 'Method',
                                                    dataIndex: 'METHOD'
                                                },
                                                {
                                                    title: 'Amount',
                                                    dataIndex: 'PAYMENT_AMOUNT'
                                                },
                                                {
                                                    title: 'Note',
                                                    dataIndex: 'COMMENTS'
                                                },
                                            ]
                                            }
                                            dataSource={record.PAYMENTS}
                                            pagination={false}
                                        >
                                        </Table>
                                    ) : null
                                )}
                            />
                        ) : null}
                        {this.state.initialValues.TYPE === 'Partner' ? (
                            <Table
                                className="ant-border-space"
                                size="small"
                                style={{ margin: '15px' }}
                                rowKey="ITEM_ID_AI"
                                columns={[
                                    {
                                        title: 'Reference Item',
                                        dataIndex: 'ITEM_CODE',
                                        render: (text, record) => (
                                            <Button type="default" style={{ height: 'auto' }}>
                                <span>
                <div>{record.ITEM_CODE}</div>
                                </span>
                                            </Button>
                                        ),
                                    },
                                    {
                                        title: 'Share Percentage',
                                        dataIndex: 'SHARE_PERCENTAGE',
                                        render: (text, record) => (
                                            <span>
                <div>{record.SHARE_PERCENTAGE}%</div>
            </span>
                                        ),
                                    },
                                    {
                                        title: 'Other Shares',
                                        dataIndex: 'OTHER_SHARES',
                                    }
                                ]}
                                dataSource={this.state.tablePayment}
                                pagination={true}
                                loading={this.state.loading}
                            />
                        ) : null}
                        {this.state.initialValues.TYPE === 'Sales Person' ? (
                            <Table
                                className="ant-border-space"
                                size="small"
                                style={{ margin: '15px' }}
                                rowKey="ITEM_ID_AI"
                                columns={[
                                    {
                                        title: 'Reference Item',
                                        dataIndex: 'ITEM_CODE',
                                        render: (text, record) => (
                                            <Button type="default" style={{ height: 'auto' }}
                                                    >
                                <span>
                <div>{record.ITEM_CODE}</div>
                                </span>
                                            </Button>
                                        ),
                                    },
                                    {
                                        title: 'Buyer',
                                        dataIndex: 'C_NAME',
                                    },
                                ]}
                                dataSource={this.state.tablePayment}
                                pagination={true}
                                loading={this.state.loading}
                            />
                        ) : null}

                        {this.state.initialValues.TYPE === 'Preformer' || this.state.initialValues.TYPE === 'Electric' || this.state.initialValues.TYPE === 'Heat T' || this.state.initialValues.TYPE === 'C&P' ? (
                            <Table
                                className="ant-border-space"
                                size="small"
                                style={{ margin: '15px' }}
                                rowKey="ITEM_ID_AI"
                                columns={[
                                    {
                                        title: 'Items With Customer',
                                        dataIndex: 'CODE',
                                        render: (text, record) => (
                                            <Button type="default" style={{ height: 'auto' }}>
                                <span>
                <div>{record.CODE}</div>
                                </span>
                                            </Button>
                                        ),
                                    },
                                ]}
                                dataSource={this.state.tablePayment}
                                pagination={true}
                                loading={this.state.loading}
                            />
                        ) : null}
                    </div>

                </Card>
            </>);
    }
}

export default CustomerURL;
