// Customers.js
import React, { Component } from 'react';
import {Button, Card, Col, Divider, Input, message, Modal, Popconfirm, Row, Table, Tooltip} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined,  } from '@ant-design/icons';
import axios from 'axios';
import AddCustomerForm from './AddCustomerForm';
import UpdateCustomerForm from './UpdateCustomerForm';

const { Search } = Input;

class Customers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            tableData: [],
            filteredTableData: [],
            isAddCustomerModalVisible: false,
            isUpdateCustomerModalVisible: false,
            selectedCustomer: null,
            type: 'view'
        };

        // Bind methods
        this.handleUpdateShow = this.handleUpdateShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllCustomers = this.getAllCustomers.bind(this);
        this.toggleAddCustomerModal = this.toggleAddCustomerModal.bind(this);
        this.toggleUpdateCustomerModal = this.toggleUpdateCustomerModal.bind(this);
        this.handleAddCustomer = this.handleAddCustomer.bind(this);
        this.handleUpdateCustomer = this.handleUpdateCustomer.bind(this);
    }

    componentDidMount() {
        this.getAllCustomers();
    }

    handleSearch = (value) => {
        const { tableData } = this.state;

        // Filter the table data based on Customer Code and Customer Name
        const filteredData = tableData.filter((record) => {
            return record.NAME.toLowerCase().includes(value.toLowerCase());
        });

        this.setState({
            filteredTableData: filteredData,
        });

        if(filteredData.length === 0){
            message.info('No Customer Found');
        }
    };

    handleUpdateShow(row, type) {
        this.setState({
            selectedCustomer: row,
            type: type,
            isUpdateCustomerModalVisible: true,
        });
    }

    handleDelete = async (customerId) => {
        try {
            // Make an API call to deactivate the customer
            const response = await axios.post('http://localhost:3001/deactivateCustomer', {
                CUSTOMER_ID: customerId,
            });

            if (response.data.success) {
                message.success('Customer deleted successfully');
                // Refresh the table
                this.getAllCustomers();
            } else {
                message.error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            message.error('Internal server error');
        }
    };


    async getAllCustomers() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://localhost:3001/getAllCustomers');

            if (response.data.success) {
                const customers = response.data.result;

                this.setState({
                    tableData: customers,
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
        // Implement logic to add a new customer using the provided values
        console.log('Add customer:', values);

        // Close the modal after adding customer
        this.toggleAddCustomerModal();
    }

    handleUpdateCustomer() {
        // Notify the parent component to refresh the table
        this.getAllCustomers();

        // Close the update modal
        this.toggleUpdateCustomerModal();
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
                    <Row gutter={[24, 0]}>
                        <Col xs="24" xl={24}>
                            <Card
                                bordered={false}
                                className="criclebox tablespace mb-24"
                                title="Customers"
                                extra={
                                    <>
                                        <Search
                                            placeholder="Search by Customer Name"
                                            onSearch={this.handleSearch}
                                            style={{ width: 300, marginRight: '16px' }}
                                        />
                                        <Button className="primary" onClick={this.toggleAddCustomerModal}>
                                            <PlusOutlined /> Add Customer
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
                                                title: 'Customer Code',
                                                dataIndex: 'CUSTOMER_ID',
                                                render: (text, record) => (
                                                    <span>CUS{String(text).padStart(3, '0')}</span>
                                                ),
                                            },
                                            {
                                                title: 'Customer Name',
                                                dataIndex: 'NAME',
                                            },
                                            {
                                                title: 'Company',
                                                dataIndex: 'COMPANY',
                                            },
                                            {
                                                title: 'Phone Number',
                                                dataIndex: 'PHONE_NUMBER',
                                            },
                                            {
                                                title: 'NIC',
                                                dataIndex: 'NIC',
                                            },
                                            {
                                                title: 'Address',
                                                dataIndex: 'ADDRESS',
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
                                  style={buttonStyle}
                                  onClick={() => this.handleUpdateShow(row, 'view')}
                              />
                            </Tooltip>
                            <Divider type="vertical" style={{ height: '50px', display: 'flex', alignItems: 'center' }} />
                            <Tooltip title="Edit">
                              <Button
                                  type="primary"
                                  icon={<EditOutlined />}
                                  style={buttonStyle}
                                  onClick={() => this.handleUpdateShow(row, 'edit')}
                              />
                            </Tooltip>
                            <Divider type="vertical" style={{ height: '50px', display: 'flex', alignItems: 'center' }} />
                            <Tooltip title="Delete">
  <Popconfirm
      title="Are you sure you want to delete this customer?"
      onConfirm={() => this.handleDelete(row.CUSTOMER_ID)}
      okText="Yes"
      cancelText="No"
  >
    <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
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
                    title="Add Customer"
                    visible={this.state.isAddCustomerModalVisible}
                    onCancel={this.toggleAddCustomerModal}
                    footer={null}
                >
                    <AddCustomerForm
                        onClose={this.toggleAddCustomerModal}
                        refreshTable={this.getAllCustomers}
                    />
                </Modal>

                {/* Update Customer Modal */}
                <Modal
                    title={this.state.type === 'view' ? 'View Customer' : 'Edit Customer'}
                    visible={this.state.isUpdateCustomerModalVisible}
                    onCancel={this.toggleUpdateCustomerModal}
                    footer={null}
                    width={this.state.type === 'view' ? 1100 : 500}
                >
                    {this.state.selectedCustomer && (
                        <UpdateCustomerForm
                            initialValues={this.state.selectedCustomer}
                            type={this.state.type}
                            key={this.state.selectedCustomer.CUSTOMER_ID}
                            onUpdate={this.getAllCustomers}
                            onCancel={this.toggleUpdateCustomerModal}
                        />
                    )}
                </Modal>
            </>
        );
    }
}

export default Customers;
