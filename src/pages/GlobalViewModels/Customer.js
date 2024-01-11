// Customer.js
import React, { Component } from 'react';
import {Form, Input, Button, Row, Col, message, Table, InputNumber, Tooltip, Modal, Card} from 'antd';
import axios from 'axios';
import {EyeOutlined} from "@ant-design/icons";
import ViewTransactionForm from "../Transaction/Commen/ViewTransactionForm";

class Customer extends Component {
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
        this.getCustomerTransactions();
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
        console.log('row', row);
        this.setState({
            selectedItem: row,
            isViewModalVisible: true,
        });
        console.log('selectedItem', this.state.selectedItem);
    }

    async getCustomerDetails() {
        this.setState({ loading: true });

        try {
            console.log('this.props.customerId', this.props);
            const response = await axios.post('http://localhost:3001/getCustomerDetails', {
                CUSTOMER_ID: this.props.customerId,
            });


            if (response.data.success) {
                const items = response.data.result;
                console.log('items', items);
                this.setState({ initialValues: items });

                // set the form values
                this.formRef.current.setFieldsValue({
                    NAME: items.NAME,
                    PHONE_NUMBER: items.PHONE_NUMBER,
                    NIC: items.NIC,
                    COMPANY: items.COMPANY,
                    ADDRESS: items.ADDRESS,
                });
            } else {
                console.log('Error:', response.data.message);
            }
        } catch (error) {
            console.log('Error:', error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    }

    async getCustomerTransactions() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://localhost:3001/getCustomerTransactions', {
                CUSTOMER_ID: this.props.customerId,
            });

            if (response.data.success) {
                const items = response.data.result;
                console.log('items', items);
                this.setState({ tablePayment: items });
            } else {
                console.log('Error:', response.data.message);
            }
        } catch (error) {
            console.log('Error:', error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    }


    render() {
        const { form } = this.state;
        const { type } = this.props;

        const inputStyle = {
            pointerEvents: "none",
            background: "#ffffff",
            width: "100%",
        };
        const buttonStyle = {
            width: '50px',
            height: '50px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        };

        return (
            <Form ref={this.formRef} layout="vertical">
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="NAME"
                            label="Customer Name"
                            rules={[{ required: true, message: 'Please enter customer name' }]}
                        >
                            <Input placeholder="Enter customer name" style={inputStyle} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="PHONE_NUMBER" label="Phone Number">
                            <Input placeholder="Enter phone number" style={inputStyle} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="NIC" label="NIC Number">
                            <Input placeholder="Enter NIC number" style={inputStyle} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="COMPANY"
                            label="Company"
                        >
                            <Input placeholder="Enter a company" style={inputStyle} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="ADDRESS" label="Customer Address">
                            <Input.TextArea rows={4} placeholder="Enter customer address" style={inputStyle} />
                        </Form.Item>
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
                                onClick={() => { }}
                            >
                                Transactions Related To This Customer
                            </button>
                        }
                    >
                        <div className="table-responsive">
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
                                                             parser={(value) => value.replace(/\Rs.\s?|(,*)/g, '')}
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
                                    {
                                        title: 'Action',
                                        width: '120px',
                                        align: 'center',
                                        render: (row) => (
                                            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Tooltip title="View">
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        size="large"
                        style={buttonStyle}
                        onClick={() => this.handleViewShow(row)}
                    />
                  </Tooltip>
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
                        </div>
                        <Modal
                            title="View Transaction"
                            visible={this.state.isViewModalVisible}
                            onCancel={this.toggleViewModal}
                            footer={null}
                            width={1250}
                        >
                            {this.state.selectedItem && (
                                <ViewTransactionForm
                                    key={this.state.selectedItem.TRANSACTION_ID}
                                    initialValues={this.state.selectedItem}
                                />
                            )}
                        </Modal>
                    </Card>
            </Form>
        );
    }
}

export default Customer;
