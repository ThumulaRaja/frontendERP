import React from 'react';
import {Button, Card, Table, Tooltip, Divider, Popconfirm, InputNumber, Modal} from 'antd';
import { EyeOutlined, ExclamationCircleOutlined, DeleteOutlined ,PrinterOutlined} from '@ant-design/icons';
import customers from "../../Customers/Customers";



let BankTableCard = ({
                            title,
                            backgroundColor,
                            dataSource,
                            handleViewShow,
                            showReferenceItem,
                            showCustomer,
                            handlePrint,
                            handleDelete,
                            loading,
                        }) => {
    const buttonStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const buttonStylePrint = {
        width: '50px',
        height: '50px',
        borderRadius: '20px',
        backgroundColor: '#52c41a',
        display: 'flex',
        color: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    };


    const showDeleteAllPaymentsConfirm = (itemId) => {
        Modal.confirm({
            title: 'Do you want to delete the transaction with its all payments?',
            icon: <ExclamationCircleOutlined />,
            width: '600px',
            content: (
                <div>
                    'This action will permanently delete the transaction and all associated payments.'
                    <Button
                        type="primary"
                        style={{ float: 'right', marginTop: '20px' }}
                        onClick={() => { handleDelete(itemId, true); Modal.destroyAll(); }}
                    >
                        Yes, Delete All Payments
                    </Button>
                    <Button
                        danger
                        style={{ float: 'left', marginTop: '20px' }}
                        onClick={() => { handleDelete(itemId, false); Modal.destroyAll(); }}
                    >
                        Only Delete Transaction
                    </Button>
                </div>
            ),
            footer: null,
            closable: true,
        });
    };


    return (
        <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={
                <button
                    style={{
                        color: '#FFFFFF',
                        background: backgroundColor,
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'default',
                    }}
                    onClick={() => {}}
                >
                    {title}
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
                                        onClick={() => showReferenceItem(record.ITEM_ID_AI)}>
                                <span>
                <div>{record.ITEM_CODE}</div>
                                </span>
                                </Button>
                            ),
                        },
                        {
                            title: 'Customer Name',
                            dataIndex: 'C_NAME',
                            render: (text, record) => (
                                <Button type="default" style={{ height: 'auto' , width: '100%' }} onClick={() => showCustomer(record.CUSTOMER_ID)}>
                                <span>
                <div>{record.C_NAME}</div>
                <div>{record.PHONE_NUMBER}</div>
                <div>({record.COMPANY})</div>
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
                        onClick={() => handleViewShow(row)}
                    />
                  </Tooltip>
                  <Divider
                      type="vertical"
                      style={{ height: '50px', display: 'flex', alignItems: 'center' }}
                  />
                                    <Tooltip title="Print">
                    <Button
                        type="default"
                        icon={<PrinterOutlined />}
                        size="large"
                        style={buttonStylePrint}
                        onClick={() => handlePrint(row)}
                    />
                  </Tooltip>
                  <Divider
                      type="vertical"
                      style={{ height: '50px', display: 'flex', alignItems: 'center' }}
                  />
                  <Tooltip title="Delete">
                    <Popconfirm
                        title={`Are you sure you want to delete this ${title}?`}
                        onConfirm={() => showDeleteAllPaymentsConfirm(row.TRANSACTION_ID)}
                        okText="Yes"
                        cancelText="No"
                    >
    <Button
        danger
        type="primary"
        icon={<DeleteOutlined />}
        size="large"
        style={buttonStyle}
    />
</Popconfirm>
                  </Tooltip>
                </span>
                            ),
                        },
                    ]}
                    dataSource={dataSource}
                    pagination={true}
                    loading={loading}
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
        </Card>
    );
};

export default BankTableCard;
