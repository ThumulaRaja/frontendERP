/* eslint-disable */

import React, { Component } from 'react';
import {
    Button,
    Card,
    Col,
    Divider,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Table,
    Tooltip
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddExpenses from './AddExpenses';
import UpdateExpenses from './UpdateExpenses';

const { Search } = Input;
const { Option } = Select;


class Expenses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            tableData: [],
            filteredTableData: [],
            isAddCustomerModalVisible: false,
            isUpdateCustomerModalVisible: false,
            selectedCustomer: null,
            referenceOptions: [],
        };

        // Bind methods
        this.handleUpdateShow = this.handleUpdateShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllCustomersHT = this.getAllCustomersHT.bind(this);
        this.toggleAddCustomerModal = this.toggleAddCustomerModal.bind(this);
        this.toggleUpdateCustomerModal = this.toggleUpdateCustomerModal.bind(this);
        this.handleAddCustomer = this.handleAddCustomer.bind(this);
        this.handleUpdateCustomer = this.handleUpdateCustomer.bind(this);
    }

    async componentDidMount() {
        this.getAllCustomersHT();
        try {
            const referenceOptions = await this.fetchReferenceOptions();
            this.setState({referenceOptions});
        } catch (error) {
            console.error('Error fetching reference options:', error);
        }
    }

    handleSearch = (value) => {
        const { tableData } = this.state;

        // Filter the table data based on Expenses Code and Expenses Name
        const filteredData = tableData.filter((record) => {
            return record.CODE.toLowerCase().includes(value.toLowerCase());
        });

        this.setState({
            filteredTableData: filteredData,
        });

        if(filteredData.length === 0){
            message.info('No Expenses Found');
        }
    };

    handleUpdateShow(row) {
        this.setState({
            selectedCustomer: row,
            isUpdateCustomerModalVisible: true,
        });
    }

    handleDelete = async (Id) => {
        try {
            // Make an API call to deactivate the Expenses
            const response = await axios.post('http://35.154.1.99:3001/deactivateExpenses', {
                EXPENSES_ID: Id,
            });

            if (response.data.success) {
                message.success('Expenses deleted successfully');
                // Refresh the table
                this.getAllCustomersHT();
            } else {
                message.error('Failed to delete Expenses');
            }
        } catch (error) {
            console.error('Error deleting Expenses:', error);
            message.error('Internal server error');
        }
    };


    async getAllCustomersHT() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getAllExpenses');

            if (response.data.success) {
                const customers = response.data.result;

                this.setState({
                    tableData: customers,
                });
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

    toggleAddCustomerModal() {
        this.setState({
            isAddCustomerModalVisible: !this.state.isAddCustomerModalVisible,
        });
    }

    toggleUpdateCustomerModal() {
        this.setState({
            isUpdateCustomerModalVisible: !this.state.isUpdateCustomerModalVisible,
        });
    }

    handleAddCustomer(values) {
        // Implement logic to add a new Expenses using the provided values
        //console.log('Add Expenses:', values);

        // Close the modal after adding Expenses
        this.toggleAddCustomerModal();
    }

    handleUpdateCustomer() {
        // Notify the parent component to refresh the table
        this.getAllCustomersHT();

        // Close the update modal
        this.toggleUpdateCustomerModal();
    }

    async fetchReferenceOptions() {
        try {
            const response = await axios.post('http://35.154.1.99:3001/getItemsForReference');
            //console.log('response', response);
            return response.data.result.map((ref) => ({
                value: ref.ITEM_ID_AI,
                label: ref.CODE,
            }));
        } catch (error) {
            console.error('Error fetching reference options:', error);
            return [];
        }
    }

    render() {
        const buttonStyle = {
            width: '50px',
            height: '50px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        };

        return (
            <>
                <div className="tabled">
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <Card
                                bordered={false}
                                className="criclebox tablespace mb-24"
                                title="Expenses"
                                extra={
                                    <>
                                        <Search
                                            placeholder="Search by Expenses Code"
                                            onSearch={this.handleSearch}
                                            style={{ width: 300, marginRight: '16px' }}
                                            allowClear
                                        />
                                        <Button className="primary" onClick={this.toggleAddCustomerModal}>
                                            <PlusOutlined /> Add Expenses
                                        </Button>
                                    </>
                                }
                            >
                                <div className="table-responsive">
                                    <Table
                                        className="ant-border-space"
                                        size="small"
                                        style={{ margin: '15px' }}
                                        rowKey="CUSTOMER_ID"
                                        columns={[
                                            {
                                                title: 'Expenses Code',
                                                dataIndex: 'CODE',
                                            },
                                            {
                                                title: 'Method',
                                                dataIndex: 'METHOD',
                                            },
                                            {
                                                title: 'Amount',
                                                dataIndex: 'AMOUNT',
                                                render: (text, record) => {
                                                    return (
                                                        <span>Rs {text}</span>
                                                    );
                                                },
                                            },
                                            // {
                                            //     title: "References",
                                            //     dataIndex: "REFERENCE",
                                            //     width: '40%',
                                            //     render: (text, record) => {
                                            //         const designationIds = text.split(",").map(Number);
                                            //         const isDisabled = true; // Set this to true or false based on your condition
                                            //
                                            //         const selectStyle = isDisabled
                                            //             ? {
                                            //                 width: "100%",
                                            //                 pointerEvents: "none", // Disable pointer events to prevent interaction
                                            //                 background: "#f5f5f5", // Set a background color to indicate it's disabled
                                            //             }
                                            //             : { width: "100%" };
                                            //
                                            //         return (
                                            //             <Select
                                            //                 style={selectStyle}
                                            //                 mode="tags"
                                            //                 value={designationIds}
                                            //                 className={`custom-disabled-select ${isDisabled ? "disabled-select" : ""}`}
                                            //             >
                                            //                 {this.state.referenceOptions.map((option) => (
                                            //                     <Option key={option.value} value={option.value} title={option.label}>
                                            //                         {option.label}
                                            //                     </Option>
                                            //                 ))}
                                            //             </Select>
                                            //         );
                                            //     },
                                            // },
                                            {
                                                title: 'Reference',
                                                dataIndex: 'REFERENCE',
                                                render: (text, record) => (
                                                    <Button type="default" style={{ height: 'auto' }}
                                                            // onClick={() => this.showReferenceItem(record.ITEM_ID_AI)}
                                                        >
                                <span>
                <div>{record.REFERENCE_CODE}</div>
                                </span>
                                                    </Button>
                                                ),
                                            },
                                            {
                                                title: 'Reason',
                                                dataIndex: 'REASON',
                                            },
                                            {
                                                title: 'Action',
                                                width: '120px',
                                                align: 'center',
                                                render: (row) => (
                                                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Tooltip title="Edit">
                              <Button
                                  type="primary"
                                  icon={<EditOutlined />}
                                  size="large"
                                  style={buttonStyle}
                                  onClick={() => this.handleUpdateShow(row)}
                              />
                            </Tooltip>
                            <Divider type="vertical" style={{ height: '50px', display: 'flex', alignItems: 'center' }} />
                            <Tooltip title="Delete">
  <Popconfirm
      title="Are you sure you want to delete this Expenses?"
      onConfirm={() => this.handleDelete(row.EXPENSES_ID)}
      okText="Yes"
      cancelText="No"
  >
    <Button
        type="primary"
        danger
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
                                        dataSource={
                                            this.state.filteredTableData.length > 0
                                                ? this.state.filteredTableData
                                                : this.state.tableData
                                        }
                                        pagination={true}
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Modal
                    title="Add Expenses"
                    visible={this.state.isAddCustomerModalVisible}
                    onCancel={this.toggleAddCustomerModal}
                    footer={null}
                >
                    <AddExpenses
                        onClose={this.toggleAddCustomerModal}
                        refreshTable={this.getAllCustomersHT}
                    />
                </Modal>

                {/* Update Expenses Modal */}
                <Modal
                    title="Update Expenses"
                    visible={this.state.isUpdateCustomerModalVisible}
                    onCancel={this.toggleUpdateCustomerModal}
                    footer={null}
                >
                    {this.state.selectedCustomer && (
                        <UpdateExpenses
                            initialValues={this.state.selectedCustomer}
                            onUpdate={this.getAllCustomersHT}
                            onCancel={this.toggleUpdateCustomerModal}
                        />
                    )}
                </Modal>
            </>
        );
    }
}

export default Expenses;
