import React, { Component} from 'react';
import {
    Button, Card,
    Col, DatePicker, Divider, Form,
    Input,
    InputNumber,
    message,
    Modal, Popconfirm,
    Row,
    Select, Table, Tooltip
} from 'antd';
import axios from 'axios';
import BankTableCard from './BankTableCard';
import ViewTransactionForm  from "../Commen/ViewTransactionForm";
import {DeleteOutlined, EyeOutlined, PrinterOutlined} from "@ant-design/icons";
import Item from "../../GlobalViewModels/Item";
import Customer from "../../GlobalViewModels/Customer";



const { Option } = Select;
const { RangePicker } = DatePicker;


class Bank extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            loading: false,
            filteredTableData: [],
            isUpdateModalVisible: false,
            isViewModalVisible: false,
            selectedItem: null,
            tableBuying : [],
            tableSelling  : [],
            tablePayment : [],

            isViewItemModalVisible: false,
            selectedRefferenceItem: null,
            selectedCustomer: null,
            isViewModalCustomerVisible: false,


            searchCode: '',
            searchStatus: '',
            searchStartDate: null,
            searchEndDate: null,
        };

        // Bind methods
        this.handleViewShow = this.handleViewShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllBankTransactions = this.getAllBankTransactions.bind(this);
        this.toggleViewModal = this.toggleViewModal.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.showReferenceItem = this.showReferenceItem.bind(this);
        this.showCustomer = this.showCustomer.bind(this);

    }



    componentDidMount() {
        this.getAllBankTransactions();
    }


    showReferenceItem(itemId){
        console.log('itemId', itemId);
        this.setState({
            selectedRefferenceItem: itemId,
            isViewItemModalVisible: true,
        });
    }



    showCustomer(customerId){
        this.setState({
            selectedCustomer: customerId,
            isViewModalCustomerVisible: true,
        });
    }

    handlePrint = async (row) => {
        console.log('row', row);
        try {
            const response = await axios.post('http://35.154.1.99:3001/generateInvoice', {
                data: row,
            });

            if (response.data.success) {
                const blob = new Blob([new Uint8Array(atob(response.data.data).split('').map(char => char.charCodeAt(0)))], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                // Removed the line that sets the 'download' attribute
                link.target = '_blank'; // This line makes it open in a new tab
                link.click();
            } else {
                console.error('Error generating invoice:', response.data.message);
                // Handle error, e.g., display an error message
            }
        } catch (error) {
            console.error('Error generating invoice:', error.message);
            // Handle error, e.g., display an error message
        }
    };

    handleClear = async () => {
        this.setState({ loading: true });

        try {
            // Prepare the search criteria
            const searchData = {
                code: null,
                status: null,
                startDate: null,
                endDate: null,
            };

            this.formRef.current.resetFields();

            this.setState({
                searchCode: null,
                searchStatus: null,
                searchStartDate: null,
                searchEndDate: null,
            });

            // Make an AJAX request to search for data
            const response = await axios.post('http://35.154.1.99:3001/searchBank', searchData);


            if (response.data.success) {
                const filteredItems = response.data.result;

                console.log('filteredItems', filteredItems);

                // Categorize filtered items based on CP_TYPE
                const categorizedTables = {
                    Buying: [],
                    Payment: [],
                    Selling: [],
                };

                filteredItems.forEach(item => {
                    const { TYPE } = item;
                    switch (TYPE) {
                        case 'Buying':
                            categorizedTables.Buying.push(item);
                            break;
                        case 'Selling':
                            categorizedTables.Selling.push(item);
                            break;
                        case 'B Payment':
                            categorizedTables.Payment.push(item);
                            break;
                        case 'S Payment':
                            categorizedTables.Payment.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableBuying: categorizedTables.Buying,
                    tableSelling: categorizedTables.Selling,
                    tablePayment: categorizedTables.Payment,
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
    };

    handleSearch = async () => {
        this.setState({ loading: true });

        try {
            // Prepare the search criteria
            const searchData = {
                code: this.state.searchCode,
                status: this.state.searchStatus,
                startDate: this.state.searchStartDate,
                endDate: this.state.searchEndDate,
            };

            this.setState({
                searchCode: null,
                searchStatus: null,
                searchStartDate: null,
                searchEndDate: null,
            });

            // Make an AJAX request to search for data
            const response = await axios.post('http://35.154.1.99:3001/searchBank', searchData);


            if (response.data.success) {
                const filteredItems = response.data.result;
                console.log('filteredItems', filteredItems);

                message.info(response.data.message);

                this.formRef.current.resetFields();

                // Categorize filtered items based on TYPE
                const categorizedTables = {
                    Buying: [],
                    Payment: [],
                    Selling: [],
                };

                filteredItems.forEach(item => {
                    const { TYPE } = item;
                    switch (TYPE) {
                        case 'Buying':
                            categorizedTables.Buying.push(item);
                            break;
                        case 'Selling':
                            categorizedTables.Selling.push(item);
                            break;
                        case 'B Payment':
                            categorizedTables.Payment.push(item);
                            break;
                        case 'S Payment':
                            categorizedTables.Payment.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableBuying: categorizedTables.Buying,
                    tablePayment: categorizedTables.Payment,
                    tableSelling: categorizedTables.Selling,
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
    };



    handleViewShow(row) {
        console.log('row', row);
        this.setState({
            selectedItem: row,
            isViewModalVisible: true,
        });
        console.log('selectedItem', this.state.selectedItem);
    }


    handleDelete = async (id,all) => {
        console.log('id', id);
        console.log('all', all);
        try {
            // Make an API call to deactivate the customer
            const response = await axios.post('http://35.154.1.99:3001/deactivateTransaction', {
                TRANSACTION_ID: id,
                ALL: all,
            });

            if (response.data.success) {
                message.success('Transaction deleted successfully');
                // Refresh the table
                await this.getAllBankTransactions();
            } else {
                message.error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            message.error('Internal server error');
        }
    };

    deletePayment = async (id ,paymentAmount , amountSettled , dueAmount,referenceTransaction) => {
        console.log('id', id);
        try {
            // Make an API call to deactivate the customer
            const response = await axios.post('http://35.154.1.99:3001/deletePayment', {
                TRANSACTION_ID: id,
                PAYMENT_AMOUNT: paymentAmount,
                AMOUNT_SETTLED: amountSettled,
                DUE_AMOUNT: dueAmount,
                REFERENCE_TRANSACTION: referenceTransaction,
            });

            if (response.data.success) {
                message.success('Payment deleted successfully');
                // Refresh the table
                await this.getAllBankTransactions();
            } else {
                message.error('Failed to delete payment');
            }
        } catch (error) {
            console.error('Error deleting payment:', error);
            message.error('Internal server error');
        }
    }


    async getAllBankTransactions() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getAllBankTransactions');

            if (response.data.success) {
                const items = response.data.result;
                console.log('items', items);


                // Categorize items based on TYPE
                const categorizedTables = {
                    Buying: [],
                    Payment: [],
                    Selling: [],
                };

                items.forEach(item => {
                    const { TYPE } = item;
                    switch (TYPE) {
                        case 'Buying':
                            categorizedTables.Buying.push(item);
                            break;
                        case 'B Payment':
                            categorizedTables.Payment.push(item);
                            break;
                        case 'S Payment':
                            categorizedTables.Payment.push(item);
                            break;
                        case 'Selling':
                            categorizedTables.Selling.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableBuying: categorizedTables.Buying,
                    tablePayment: categorizedTables.Payment,
                    tableSelling: categorizedTables.Selling,
                });
                console.log('tablePayment', this.state.tablePayment);
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

    toggleViewModal() {
        this.setState({
            isViewModalVisible: !this.state.isViewModalVisible,
            selectedItem: null,
        });
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
            <>
                {/* Search Filter */}
                <div>
                    <Form
                        ref={this.formRef}
                        initialValues={{
                            searchCode: null,
                            searchStatus: null,
                            searchDateRange: null,
                        }}
                        onFinish={this.handleSearch}
                    >
                        <Row gutter={[16, 16]} justify="left" align="top">
                            <Col xs={24} sm={24} md={24} lg={6}>
                                <Form.Item name="searchCode">
                                    <Input
                                        placeholder="Search by Transaction Code"
                                        onChange={(e) => this.setState({ searchCode: e.target.value })}
                                        style={{ width: '100%'}}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6}>
                                <Form.Item name="searchStatus">
                                    <Select
                                        placeholder="Filter by Status"
                                        onChange={(value) => this.setState({ searchStatus: value })}
                                        style={{ width: '100%'}}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="Working">Working</Option>
                                        <Option value="Treatment">Treatment</Option>
                                        <Option value="Sold">Sold</Option>
                                        <Option value="Finished">Finished</Option>
                                        <Option value="Stuck">Stuck</Option>
                                        <Option value="With Seller">With Seller</Option>
                                        <Option value="Cutting">Cutting</Option>
                                        <Option value="Ready for Selling">Ready for Selling</Option>
                                        <Option value="Heat Treatment">Heat Treatment</Option>
                                        <Option value="Electric Treatment">Electric Treatment</Option>
                                        <Option value="C&P">C&P</Option>
                                        <Option value="Preformed">Preformed</Option>
                                        <Option value="Added to a lot">Added to a lot</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6}>
                                <Form.Item name="searchDateRange">
                                    <RangePicker
                                        style={{ width: '100%' }}
                                        onChange={(dates) => {
                                            this.setState({
                                                searchStartDate: dates && dates.length === 2 ? dates[0].format('YYYY-MM-DD') : null,
                                                searchEndDate: dates && dates.length === 2 ? dates[1].format('YYYY-MM-DD') : null,
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6}>
                                <Form.Item>
                                    <Button type="default" htmlType="submit" style={{ marginRight: '8px' }}>
                                        Filter
                                    </Button>
                                    <Button type="default" danger onClick={this.handleClear} style={{ marginRight: '8px' }}>
                                        Clear
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* Cards and Tables */}
                <div className="tabled">
                    {this.state.tableBuying.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <BankTableCard
                                title="Buying"
                                backgroundColor="#E2445C"
                                dataSource={this.state.tableBuying}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handlePrint={this.handlePrint}
                                handleDelete={this.handleDelete}
                                showReferenceItem={this.showReferenceItem}
                                showCustomer={this.showCustomer}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tableSelling.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <BankTableCard
                                title="Selling"
                                backgroundColor="#579AFA"
                                dataSource={this.state.tableSelling}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handlePrint={this.handlePrint}
                                handleDelete={this.handleDelete}
                                showReferenceItem={this.showReferenceItem}
                                showCustomer={this.showCustomer}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tablePayment.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <Card
                                bordered={false}
                                className="criclebox tablespace mb-24"
                                title={
                                    <button
                                        style={{
                                            color: '#FFFFFF',
                                            background: `#52c41a`,
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '8px 16px',
                                            cursor: 'default',
                                        }}
                                        onClick={() => {}}
                                    >
                                        Payment
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
                                                render: (text, record) => (
                                                    <span>
                                                        <div>Code : {record.CODE}</div>
                                                        {record.REF_CODE.length > 0 ? (
                                                        <div>Ref Code {record.REF_CODE[0].REF_CODE}</div>
                                                        ): (
                                                            <div>Ref Code : N/A</div>
                                                        )}
                                                    </span>
                                                ),
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
                                                title: 'Customer Name',
                                                dataIndex: 'C_NAME',
                                                render: (text, record) => (
                                                    <Button type="default" style={{ height: 'auto' , width: '100%' }} onClick={() => this.showCustomer(record.CUSTOMER_ID)}>
                                <span>
                <div>{record.C_NAME}</div>
                <div>{record.PHONE_NUMBER}</div>
                <div>({record.COMPANY})</div>
            </span>
                                                    </Button>
                                                ),
                                            },
                                            {
                                                title: 'Payment',
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
            {record.REF_CODE.length > 0 ? (
                <>
                    <div>Amount: Rs. {record.REF_CODE[0].REF_AMOUNT}</div>
                    <div style={{ color: 'green' }}>Amount Settled: Rs. {record.REF_CODE[0].REF_AMOUNT_SETTLED}</div>
                    <div style={{ color: 'red' }}>Due Amount: Rs. {record.REF_CODE[0].REF_DUE_AMOUNT}</div>
                </>
            ) : (
                <div>Amount: N/A</div>
            )}
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
                        onClick={() => this.handlePrint(row)}
                    />
                  </Tooltip>
                                                        <Divider
                                                            type="vertical"
                                                            style={{ height: '50px', display: 'flex', alignItems: 'center' }}
                                                        />
                  <Tooltip title="Delete">
                    <Popconfirm
                        title={`Are you sure you want to delete this payment?`}
                        onConfirm={() => this.deletePayment(row.TRANSACTION_ID,row.PAYMENT_AMOUNT, row.AMOUNT_SETTLED,row.DUE_AMOUNT,row.REFERENCE_TRANSACTION)}
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
                                        dataSource={this.state.tablePayment}
                                        loading={this.state.loading}
                                        pagination={true}
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    )}
                </div>

                {/* View Transaction Modal */}
                <Modal
                    title="View Transaction"
                    visible={this.state.isViewModalVisible}
                    onCancel={this.toggleViewModal}
                    footer={null}
                    width={1250}
                >
                    {this.state.selectedItem && (
                        <ViewTransactionForm
                            key={this.state.selectedItem.TRANSACTION_ID} // Pass a key to ensure a new instance is created
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

                <Modal
                    title="View Customer"
                    visible={this.state.isViewModalCustomerVisible}
                    onCancel={() => this.setState({ isViewModalCustomerVisible: false })}
                    footer={null}
                    width={1250}
                >
                    {this.state.selectedCustomer && (
                        <Customer
                            key={this.state.selectedCustomer} // Pass a key to ensure a new instance is created
                            customerId={this.state.selectedCustomer}
                        />
                    )}
                </Modal>
            </>
        );
    }
}

export default Bank;
