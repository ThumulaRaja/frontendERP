//eslint-disable
import React, { Component } from 'react';
import {Form, Input, Button, Row, Col, message, Table, InputNumber, Tooltip, Modal, Card, Select} from 'antd';
import axios from 'axios';
import {EyeOutlined} from "@ant-design/icons";
import ViewTransactionForm from "../Transaction/Commen/ViewTransactionForm";
import Item from "../GlobalViewModels/Item";

class UpdateCustomerForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: null,
            loading: false,
            tablePayment: [],
            isUpdateModalVisible: false,
            isViewModalVisible: false,
            selectedItem: null,
        };
        this.getCustomerTransactions();
        this.toggleViewModal = this.toggleViewModal.bind(this);
        this.handleViewShow = this.handleViewShow.bind(this);
    }
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

    async getCustomerTransactions() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getCustomerTransactions', {
                CUSTOMER_ID: this.props.initialValues.CUSTOMER_ID,
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

    componentDidMount() {
        const { initialValues } = this.props;
        const { form } = this.state;

        if (form && initialValues) {
            form.setFieldsValue(initialValues);
        }
    }

    handleSubmit = async (values) => {
        const { initialValues, onUpdate, onCancel } = this.props;

        try {
            const updatedValues = {
                ...values,
                IS_ACTIVE: 1,
                CUSTOMER_ID: initialValues.CUSTOMER_ID,
            };

            const response = await axios.post('http://35.154.1.99:3001/updateCustomer', updatedValues);

            if (response.data.success) {
                message.success('Customer updated successfully');
                onUpdate();
                onCancel();
                this.state.form.resetFields();
            } else {
                message.error('Failed to update customer');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            message.error('Internal server error');
        }
    };

    showReferenceItem(itemId){
        console.log('itemId', itemId);
        this.setState({
            selectedRefferenceItem: itemId,
            isViewItemModalVisible: true,
        });
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

        // const buttonStylePrint = {
        //     width: '50px',
        //     height: '50px',
        //     borderRadius: '20px',
        //     backgroundColor: '#52c41a',
        //     display: 'flex',
        //     color: '#FFFFFF',
        //     alignItems: 'center',
        //     justifyContent: 'center',
        // };
        return (
            <Form form={form} layout="vertical" onFinish={this.handleSubmit}>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                            name="NAME"
                            label="Customer Name"
                            rules={[{ required: true, message: 'Please enter customer name' }]}
                            initialValue={this.props.initialValues.NAME}
                        >
                            <Input placeholder="Enter customer name" style={type === "view" ? inputStyle : { width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item name="PHONE_NUMBER" label="Phone Number" initialValue={this.props.initialValues.PHONE_NUMBER}>
                            <Input placeholder="Enter phone number" style={type === "view" ? inputStyle : { width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item name="NIC" label="NIC Number" initialValue={this.props.initialValues.NIC}>
                            <Input placeholder="Enter NIC number" style={type === "view" ? inputStyle : { width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                            name="TYPE"
                            label="Customer Type"
                            initialValue={this.props.initialValues.TYPE}
                        >
                            <Select
                                placeholder="Select a customer type"
                                allowClear
                            >
                                <Select.Option value="Seller">Seller</Select.Option>
                                <Select.Option value="Buyer">Buyer</Select.Option>
                                <Select.Option value="Sales Person">Sales Person</Select.Option>
                                <Select.Option value="Partner">Partner</Select.Option>
                                <Select.Option value="Preformer">Preformer</Select.Option>
                                <Select.Option value="C&P">C&P</Select.Option>
                                <Select.Option value="Electric">Electric</Select.Option>
                                <Select.Option value="Heat T">Heat T</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                            name="COMPANY"
                            label="Company"
                            initialValue={this.props.initialValues.COMPANY}
                        >
                            <Input placeholder="Enter a company" style={type === "view" ? inputStyle : { width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item name="ADDRESS" label="Customer Address" initialValue={this.props.initialValues.ADDRESS}>
                            <Input.TextArea rows={4} placeholder="Enter customer address" style={type === "view" ? inputStyle : { width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                {type === "edit" ? (
                        <Row gutter={[16, 16]} justify="left" align="top">
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Update Customer
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    ) : null}

                {type === "view" ? (
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

                        <Modal
                            title="View Item"
                            visible={this.state.isViewItemModalVisible}
                            onCancel={() => this.setState({ isViewItemModalVisible: false })}
                            footer={null}
                            width={1250}
                        >
                            {this.state.selectedRefferenceItem && (
                                <Item
                                    key={this.state.selectedRefferenceItem} // Pass a key to ensure a new instance is created
                                    itemId={this.state.selectedRefferenceItem}
                                />
                            )}
                        </Modal>
                    </Card>
                ) : null}
            </Form>
        );
    }
}

export default UpdateCustomerForm;
