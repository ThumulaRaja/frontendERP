// /* eslint-disable */
import React from 'react';
import {Button, Card, Table, Tooltip, Divider, Popconfirm, InputNumber} from 'antd';
import {EyeOutlined, EditOutlined, DeleteOutlined, QrcodeOutlined} from '@ant-design/icons';

let LotsTableCard = ({
                            title,
                            backgroundColor,
                            dataSource,
                            handleUpdateShow,
                            handleViewShow,
                            handleDelete,
                            loading,
    handlePrint,
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
                    rowKey="ITEM_ID_AI"
                    columns={[
                        {
                            title: 'Item Code',
                            dataIndex: 'CODE',
                        },
                        {
                            title: 'Status',
                            dataIndex: 'STATUS',
                        },

                        {
                            title: 'No of Pieces',
                            dataIndex: 'PIECES',
                        },
                        {
                            title: 'Weight',
                            dataIndex: 'WEIGHT',
                        },
                        {
                            title: 'Policy',
                            dataIndex: 'POLICY',
                        },
                        {
                            title: 'Cost',
                            dataIndex: 'COST',
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
                            title: 'In Inventory',
                            dataIndex: 'IS_IN_INVENTORY',
                            render: (text, record) => {
                                return text === 1 ? <span style={{ color: 'green' }}>Yes</span> : <span style={{ color: 'red' }}>No</span>;
                            }
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
                  <Tooltip title="Edit">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="large"
                        style={buttonStyle}
                        onClick={() => handleUpdateShow(row)}
                    />
                  </Tooltip>
                  <Divider
                      type="vertical"
                      style={{ height: '50px', display: 'flex', alignItems: 'center' }}
                  />
                  <Tooltip title="Delete">
                    <Popconfirm
                        title={`Are you sure you want to delete this ${title}?`}
                        onConfirm={() => handleDelete(row.ITEM_ID_AI)}
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
                                    <Divider
                                        type="vertical"
                                        style={{ height: '50px', display: 'flex', alignItems: 'center' }}
                                    />
                                    <Tooltip title="Print QR">
                    <Button
                        type="default"
                        icon={<QrcodeOutlined />}
                        size="large"
                        style={buttonStylePrint}
                        onClick={() => handlePrint(row)}
                    />
                  </Tooltip>
                </span>
                            ),
                        },
                    ]}
                    dataSource={dataSource}
                    pagination={true}
                    loading={loading}
                />
            </div>
        </Card>
    );
};

export default LotsTableCard;
