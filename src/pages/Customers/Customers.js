import React, { Component } from 'react';
import {
    Button,
    Card,
    Col,
    Divider,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Table,
    Tooltip,
    Select, Form,
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddCustomerForm from './AddCustomerForm';
import UpdateCustomerForm from './UpdateCustomerForm';

const { Search } = Input;
const { Option } = Select;

class Customers extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            loading: false,
            tableData: [],
            filteredTableData: [],
            filteredTableDataBuyer: [],
            filteredTableDataSeller: [],
            filteredTableSalesPerson: [],
            filteredTableDataPartner: [],
            filteredTableDataPreformer: [],
            filteredTableDataCP: [],
            filteredTableDataElectric: [],
            filteredTableDataHeatT: [],
            isAddCustomerModalVisible: false,
            isUpdateCustomerModalVisible: false,
            selectedCustomer: null,
            searchName: null,
            searchStatus: null,
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
        this.handleSearch = this.handleSearch.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.getDueCustomers = this.getDueCustomers.bind(this);
    }

    componentDidMount() {
        this.getAllCustomers();
    }

    handleSearch = (values) => {
        const { tableData } = this.state;

        const filterDataByNameAndType = (type) => {
            return tableData.filter((record) => {
                return (
                    record.TYPE === type &&
                    (this.state.searchName ? record.NAME.toLowerCase().includes(this.state.searchName.toLowerCase()) : true) &&
                    (this.state.searchStatus ? record.TYPE === this.state.searchStatus : true)
                );
            });
        };

        this.setState({
            filteredTableDataBuyer: filterDataByNameAndType('Seller'),
            filteredTableDataSeller: filterDataByNameAndType('Buyer'),
            filteredTableSalesPerson: filterDataByNameAndType('Sales Person'),
            filteredTableDataPartner: filterDataByNameAndType('Partner'),
            filteredTableDataPreformer: filterDataByNameAndType('Preformer'),
            filteredTableDataCP: filterDataByNameAndType('C&P'),
            filteredTableDataElectric: filterDataByNameAndType('Electric'),
            filteredTableDataHeatT: filterDataByNameAndType('Heat T'),
        });

        if (
            this.state.filteredTableDataBuyer.length === 0 &&
            this.state.filteredTableDataSeller.length === 0 &&
            this.state.filteredTableSalesPerson.length === 0 &&
            this.state.filteredTableDataPartner.length === 0 &&
            this.state.filteredTableDataPreformer.length === 0 &&
            this.state.filteredTableDataCP.length === 0 &&
            this.state.filteredTableDataElectric.length === 0 &&
            this.state.filteredTableDataHeatT.length === 0
        ) {
            message.info('No Customer Found');
        }
    };

    handleClear = () => {
        // Clear the search values
        this.setState({
            searchName: null,
            searchStatus: null,
        });

        this.getAllCustomers();


        // Clear the form fields
        this.formRef.current.resetFields();
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
            const response = await axios.post('http://35.154.1.99:3001/deactivateCustomer', {
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
            const response = await axios.post('http://35.154.1.99:3001/getAllCustomers');

            if (response.data.success) {
                const customers = response.data.result;

                this.setState({
                    tableData: customers,
                    filteredTableDataBuyer: customers.filter((customer) => customer.TYPE === 'Seller'),
                    filteredTableDataSeller: customers.filter((customer) => customer.TYPE === 'Buyer'),
                    filteredTableSalesPerson: customers.filter((customer) => customer.TYPE === 'Sales Person'),
                    filteredTableDataPartner: customers.filter((customer) => customer.TYPE === 'Partner'),
                    filteredTableDataPreformer: customers.filter((customer) => customer.TYPE === 'Preformer'),
                    filteredTableDataCP: customers.filter((customer) => customer.TYPE === 'C&P'),
                    filteredTableDataElectric: customers.filter((customer) => customer.TYPE === 'Electric'),
                    filteredTableDataHeatT: customers.filter((customer) => customer.TYPE === 'Heat T'),
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

    async getDueCustomers() {
        console.log('getDueCustomers');
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getDueCustomers');

            if (response.data.success) {
                const customers = response.data.result;
                console.log('customers', customers);

                this.setState({
                    tableData: customers,
                    filteredTableDataBuyer: customers.filter((customer) => customer.TYPE === 'Seller'),
                    filteredTableDataSeller: customers.filter((customer) => customer.TYPE === 'Buyer'),
                    filteredTableSalesPerson: customers.filter((customer) => customer.TYPE === 'Sales Person'),
                    filteredTableDataPartner: customers.filter((customer) => customer.TYPE === 'Partner'),
                    filteredTableDataPreformer: customers.filter((customer) => customer.TYPE === 'Preformer'),
                    filteredTableDataCP: customers.filter((customer) => customer.TYPE === 'C&P'),
                    filteredTableDataElectric: customers.filter((customer) => customer.TYPE === 'Electric'),
                    filteredTableDataHeatT: customers.filter((customer) => customer.TYPE === 'Heat T'),
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

    renderCustomerTable(type, backgroundColor, dataSource) {
        const buttonStyle = {
            width: '50px',
            height: '50px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        };

        return (

            <Row gutter={[16, 16]} justify="left" align="top">

                <Col xs="24" xl={24}>
                    <Card bordered={false} className="criclebox tablespace mb-24"
                        title={
                        <Button
                            style={{
                                color: '#FFFFFF',
                                background: backgroundColor,
                                border: 'none',
                                borderRadius: '5px',
                                // padding: '8px 16px',
                                cursor: 'default',
                            }}
                            onClick={() => {}}
                        >
                            {`${type}`}
                        </Button>
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
                                    // {
                                    //     title: 'Type',
                                    //     dataIndex: 'TYPE',
                                    // },
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
                                dataSource={dataSource}
                                pagination={true}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        );
    }

    render() {
        return (
            <>
                    <div>
                        <Form
                            ref={this.formRef}
                            initialValues={{
                                searchName: null,
                                searchStatus: null,
                            }}
                            onFinish={this.handleSearch}
                        >
                            <Row gutter={[16, 16]} justify="left" align="top">
                                <Col xs={24} sm={24} md={24} lg={6}>
                                    <Form.Item name="searchStatus">
                                        <Select
                                            placeholder="Filter by Type"
                                            onChange={(value) => this.setState({ searchStatus: value })}
                                            style={{ width: '100%' }}
                                            allowClear
                                            showSearch
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
                                <Col xs={24} sm={24} md={24} lg={6}>
                                    <Form.Item name="searchName">
                                        <Input
                                            placeholder="Search by Name"
                                            onChange={(e) => this.setState({ searchName: e.target.value })}
                                            style={{ width: '100%' }}
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={24} md={24} lg={6}>
                                    <Form.Item>
                                        <Button type="default" htmlType="submit" style={{ marginRight: '8px' }}>
                                            Filter
                                        </Button>
                                        <Button type="primary" onClick={this.getDueCustomers} style={{ marginRight: '8px' }}>
                                            Filter By Due
                                        </Button>
                                        <Button type="default" danger onClick={this.handleClear} style={{ marginRight: '8px' }}>
                                            Clear
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={6}>
                                    <Button className="primary" onClick={this.toggleAddCustomerModal} style={{ float: 'right' }}>
                                        <PlusOutlined /> Add Customer
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                <div className="tabled">
                    {this.state.filteredTableDataBuyer.length > 0 ? (
                        this.renderCustomerTable('Seller', '#E2445C', this.state.filteredTableDataBuyer)
                    ) : null}

                    {this.state.filteredTableDataSeller.length > 0 ? (
                        this.renderCustomerTable('Buyer', '#A25DDC', this.state.filteredTableDataSeller)
                    ) : null}

                    {this.state.filteredTableSalesPerson.length > 0 ? (
                        this.renderCustomerTable('Sales Person', '#FFA500', this.state.filteredTableSalesPerson)
                    ) : null}

                    {this.state.filteredTableDataPartner.length > 0 ? (
                        this.renderCustomerTable('Partner', '#579AFA', this.state.filteredTableDataPartner)
                    ) : null}

                    {this.state.filteredTableDataPreformer.length > 0 ? (
                        this.renderCustomerTable('Preformer', '#7c6700', this.state.filteredTableDataPreformer)
                    ) : null}

                    {this.state.filteredTableDataCP.length > 0 ? (
                        this.renderCustomerTable('C&P', '#32CD32', this.state.filteredTableDataCP)
                    ) : null}

                    {this.state.filteredTableDataElectric.length > 0 ? (
                        this.renderCustomerTable('Electric', '#6495ED', this.state.filteredTableDataElectric)
                    ) : null}

                    {this.state.filteredTableDataHeatT.length > 0 ? (
                        this.renderCustomerTable('Heat T', '#FF6347', this.state.filteredTableDataHeatT)
                    ) : null}

                    {/* Add Customer Modal */}
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
                </div>
            </>
        );
    }
}

export default Customers;
