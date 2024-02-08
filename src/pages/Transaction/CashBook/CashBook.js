// /* eslint-disable */
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
import ViewTransactionForm  from "../Commen/ViewTransactionForm";
import {DeleteOutlined, ExclamationCircleOutlined, EyeOutlined, PrinterOutlined} from "@ant-design/icons";
import Item from "../../GlobalViewModels/Item";
import Customer from "../../GlobalViewModels/Customer";
import Title from "antd/es/skeleton/Title";


const { Option } = Select;
const { RangePicker } = DatePicker;


class CashBook extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            loading: false,
            filteredTableData: [],
            isUpdateModalVisible: false,
            isViewModalVisible: false,
            selectedItem: null,
            tableData: [],
            customerOptions: [],
            buyerOptions: [],
            sellerOptions: [],
            salesPersonOptions: [],
            partnerOptions: [],
            htByOptions: [],
            cpByOptions: [],
            preformerOptions: [],
        etByOptions: [],
            countData: [],
            showCountCards: false,

            searchCode: '',
            searchStatus: '',
            searchStartDate: null,
            searchEndDate: null,
        };

        // Bind methods
        this.handleViewShow = this.handleViewShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllTransactionsCashBook = this.getAllTransactionsCashBook.bind(this);
        this.toggleViewModal = this.toggleViewModal.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.showReferenceItem = this.showReferenceItem.bind(this);
        this.showCustomer = this.showCustomer.bind(this);

    }

    async fetchCustomerOptions() {
        try {
            const response = await axios.post("http://35.154.1.99:3001/getAllCustomers");
            //console.log("response", response);

            // BuyerOptions Filter TYPE = Buyer
            const buyerOptions = response.data.result.filter((customer) => customer.TYPE === 'Buyer').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }
            ));

            // SellerOptions Filter TYPE = Seller
            const sellerOptions = response.data.result.filter((customer) => customer.TYPE === 'Seller').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }
            ));

            // SalesPersonOptions Filter TYPE = Sales Person
            const salesPersonOptions = response.data.result.filter((customer) => customer.TYPE === 'Sales Person').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }
            ));

            // PartnerOptions Filter TYPE = Partner
            const partnerOptions = response.data.result.filter((customer) => customer.TYPE === 'Partner').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }
            ));

            // HTByOptions Filter TYPE = HT By
            const htByOptions = response.data.result.filter((customer) => customer.TYPE === 'Heat T').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }
            ));

            // CPByOptions Filter TYPE = CP By
            const cpByOptions = response.data.result.filter((customer) => customer.TYPE === 'C&P').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }
            ));

            // PreformerOptions Filter TYPE = Preformer
            const preformerOptions = response.data.result.filter((customer) => customer.TYPE === 'Preformer').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }
            ));

            // ETByOptions Filter TYPE = Electric
            const etByOptions = response.data.result.filter((customer) => customer.TYPE === 'Electric').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }
            ));

            this.setState({ buyerOptions, sellerOptions, salesPersonOptions, partnerOptions, htByOptions, cpByOptions, preformerOptions, etByOptions });

            return response.data.result.map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }));
        } catch (error) {
            console.error("Error fetching customer options:", error);
            return [];
        }
    }

    async componentDidMount() {
        const customerOptions = await this.fetchCustomerOptions();
        this.setState({customerOptions});

        this.getAllTransactionsCashBook();
        this.fetchData();
    }

    showReferenceItem(itemId){
        //console.log('itemId', itemId);
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

    handleClear = async () => {
        this.getAllTransactionsCashBook();
        this.formRef.current.resetFields();

    };

    handleSearch = async () => {
        this.setState({ loading: true });

        await this.getAllTransactionsCashBook();

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

            //Search Using FrontEnd tableData array
            let filteredTableData = this.state.tableData;

            filteredTableData = filteredTableData.filter((item) => {
                let isValid = true;

                if (searchData.code) {
                    isValid = isValid && item.CODE.toLowerCase().includes(searchData.code.toLowerCase());
                }

                if (searchData.status) {
                    isValid = isValid && item.METHOD.toLowerCase().includes(searchData.status.toLowerCase());
                }

                if (searchData.startDate) {
                    isValid = isValid && new Date(item.DATE) >= new Date(searchData.startDate);
                }

                if (searchData.endDate) {
                    isValid = isValid && new Date(item.DATE) <= new Date(searchData.endDate);
                }

                return isValid;
            }
            );
            this.state.tableData = filteredTableData;

        } catch (error) {
            //console.log('Error:', error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    };



    handleViewShow(row) {
        //console.log('row', row);
        this.setState({
            selectedItem: row,
            isViewModalVisible: true,
        });
        //console.log('selectedItem', this.state.selectedItem);
    }


    handleDelete = async (id,all) => {
        //console.log('id', id);
        //console.log('all', all);
        try {
            // Make an API call to deactivate the customer
            const response = await axios.post('http://35.154.1.99:3001/deactivateTransaction', {
                TRANSACTION_ID: id,
                ALL: all,
            });

            if (response.data.success) {
                message.success('Transaction deleted successfully');
                // Refresh the table
                await this.getAllTransactionsCashBook();
            } else {
                message.error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            message.error('Internal server error');
        }
    };

    handlePrint = async (row) => {
        //console.log('row', row);
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

    handleDeleteExp = async (Id) => {
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



    async getAllTransactionsCashBook() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getAllTransactionsCashBook');

            if (response.data.success) {
                const items = response.data.result;
                //console.log('items', items);

                this.state.tableData = items;
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

    toggleViewModal() {
        this.setState({
            isViewModalVisible: !this.state.isViewModalVisible,
            selectedItem: null,
        });
    }

    filterDue = async () => {
        this.setState({ loading: true });
        await this.getAllTransactionsCashBook();
        let filteredDueItems = [];

        this.state.tableData.map((item) => {
            if(item.DUE === true && item.TYPE !== 'Expenses'){
                filteredDueItems.push(item);
            }
        }
        );
        this.state.tableData = filteredDueItems;
        this.setState({ loading: false });

    }

    filterByShareholder = async (value) => {
        this.setState({ loading: true });
        try {
            const response = await axios.post('http://35.154.1.99:3001/filterByShareholderCashBook', {
                shareholder: value,
            });

            if (response.data.success) {
                const items = response.data.result;
                //console.log('items', items);
                this.state.tableData = items;
            }
            else {
                this.state.tableData = [];
            }
        }
        catch (error) {
            //console.log('Error:', error.message);
            this.state.tableData = [];
        }
        finally {
            this.setState({
                loading: false,
            });
        }
    }

    fetchData = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getCashBookSumData');

            if (response.data.success) {
                //console.log('ResponseDashboard:', response.data.result);
                this.setState({ countData: response.data.result });
            } else {
                //console.log('Error:', response.data.message);
            }
        } catch (error) {
            //console.log('Error:', error.message);
        } finally {
            this.setState({ loading: false });
        }
    };

    toggleCountCards = () => {
        this.setState({ showCountCards: !this.state.showCountCards });
    }

    renderCountCards = () => {
        const { countData , showCountCards} = this.state;
        if (!countData) return null;
        if(!showCountCards) return null;

        return (
            <>
                <Card bordered={false} className="circlebox">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                            <div className="number">
                                <Row align="middle" gutter={[24, 0]}>
                                    <Col xs={24} sm={24} md={24} lg={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                marginBottom: '16px',
                                                background: '#d9d9d9',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
            <span style={{ fontSize: '20px', color: '#313131' }}>
                Cash Inflow ➕: <strong>Rs {countData.sellCashInTransactions}.00</strong>
            </span>
                                                <br />
                                                <span style={{ fontSize: '20px', color: '#313131' }}>
                Cash Outflow ➖: <strong>Rs {countData.buyCashOutTransactions}.00</strong>
            </span>
                                                <br />
                                                <span style={{ fontSize: '20px', color: '#313131' }}>
                Cash Balance 🟰: <strong>Rs {countData.cashBalance}.00</strong>
            </span>
                                            </div>
                                        </Card>
                                    </Col>



                                    <Col xs={24} sm={24} md={24} lg={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                marginBottom: '16px',
                                                background: '#d9d9d9',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
            <span style={{ fontSize: '20px', color: '#313131' }}>
                Bank Inflow ➕: <strong>Rs {countData.sellBankInTransactions}.00</strong>
            </span>
                                                <br />
                                                <span style={{ fontSize: '20px', color: '#313131' }}>
                Bank Outflow ➖: <strong>Rs {countData.buyBankOutTransactions}.00</strong>
            </span>
                                                <br />
                                                <span style={{ fontSize: '20px', color: '#313131' }}>
                Bank Balance 🟰: <strong>Rs {countData.bankBalance}.00</strong>
            </span>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                marginBottom: '16px',
                                                background: '#d6e4ff',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
            <span style={{ fontSize: '20px', color: '#313131' }}>
                Total Inflow ➕: <strong>Rs {countData.sellCashInTransactions + countData.sellBankInTransactions}.00</strong>
            </span>
                                                <br />
                                                <span style={{ fontSize: '20px', color: '#313131' }}>
                Total Outflow ➖: <strong>Rs {countData.buyCashOutTransactions + countData.buyBankOutTransactions}.00</strong>
            </span>
                                                <br />
                                                <span style={{ fontSize: '20px', color: '#313131' }}>
                Total Balance 🟰: <strong>Rs {countData.cashBalance + countData.bankBalance}.00</strong>
            </span>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                    </Col>
                </Card>

            </>
        );
    };




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
                            onClick={() => { this.handleDelete(itemId, true); Modal.destroyAll(); }}
                        >
                            Yes, Delete All Payments
                        </Button>
                        <Button
                            danger
                            style={{ float: 'left', marginTop: '20px' }}
                            onClick={() => { this.handleDelete(itemId, false); Modal.destroyAll(); }}
                        >
                            Only Delete Transaction
                        </Button>
                    </div>
                ),
                footer: null,
                closable: true,
            });
        };

        const paginationConfig = {
            pageSize: 50,
            total: this.state.tableData.length,
            showSizeChanger: false,
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
                                        placeholder="Filter by Method"
                                        onChange={(value) => this.setState({ searchStatus: value })}
                                        style={{ width: '100%'}}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="Cash">Cash</Option>
                                        <Option value="Bank">Bank</Option>
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
                                    <Button type="primary" onClick={this.filterDue} style={{ marginRight: '8px' }}>
                                        Filter Due
                                    </Button>
                                    <Button type="default" danger onClick={this.handleClear} style={{ marginRight: '8px' }}>
                                        Clear
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} justify="left" align="top">
                            <Col xs={24} sm={24} md={24} lg={6}>
                                <Form.Item
                                    name="shareholder"
                                >
                                    <Select placeholder="Select Share Holder" allowClear showSearch onChange={this.filterByShareholder}
                                            filterOption={(input, option) =>
                                                (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                                (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                            }>
                                        {this.state.partnerOptions.map((option) => (
                                            <Option key={option.value} value={option.value} title={option.label}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6}>
                                <Button type="default" onClick={this.toggleCountCards}>
                                    {this.state.showCountCards ? 'Hide Summary' : 'Show Summary'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                </div>

                {/* Cards and Tables */}
                <div className="tabled">
                    <Row className="rowgap-vbox" gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                            {this.renderCountCards()}
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <Card
                                bordered={false}
                                className="criclebox tablespace mb-24"
                                title='Cash Book'
                            >
                                <div className="table-responsive">
                                    <Table
                                        className="ant-border-space"
                                        size="small"
                                        rowKey="TRANSACTION_ID"
                                        style={{ margin: '15px' }}
                                        columns={[
                                            {
                                                title: 'Transaction Code',
                                                dataIndex: 'CODE',
                                                render: (text, record) => (
                                                    record.DUE === true ? (
                                                        <span style={{ color: 'red' }}>{record.CODE} - {record.NO_OF_LATE_DAYS} Days Late</span>
                                                    ) : (
                                                        <span>{record.CODE}</span>
                                                    )
                                                ),
                                            },

                                            {
                                                title: 'Method',
                                                dataIndex: 'METHOD',
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
                                                    record.C_NAME ? (
                                                        <Button type="default" style={{ height: 'auto' }} onClick={() => this.showCustomer(record.CUSTOMER_ID)}>
                <span>
                    <div>{record.C_NAME}</div>
                </span>
                                                        </Button>
                                                    ) : (
                                                        <span>N / A</span>
                                                    )
                                                ),
                                            },

                                            {
                                                title: 'Amount',
                                                dataIndex: 'PAYMENT_AMOUNT',
                                                render: (text, record) => (
                                                    <div>Rs. {record.PAYMENT_AMOUNT}</div>
                                                ),
                                            },
                                            // {
                                            //     title: 'Settled',
                                            //     dataIndex: 'AMOUNT_SETTLED',
                                            //     render: (text, record) => (
                                            //         record.TYPE !== 'Expenses' && (
                                            //         <div style={{ color: 'green' }}>Rs. {record.AMOUNT_SETTLED}</div>
                                            //         )
                                            //     ),
                                            // },
                                            // {
                                            //     title: 'Due',
                                            //     dataIndex: 'DUE_AMOUNT',
                                            //     render: (text, record) => (
                                            //         record.TYPE !== 'Expenses' && (
                                            //         <div style={{ color: 'red' }}>Rs. {record.DUE_AMOUNT}</div>
                                            //         )
                                            //     ),
                                            // },
                                            {
                                                title: 'Action',
                                                width: '120px',
                                                align: 'center',
                                                render: (row) => (
                                                    row.TYPE !== 'Expenses' && (
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
                        title={`Are you sure you want to delete this?`}
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
                                                    ) || ( <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Tooltip title="View">
                    <Button
                        disabled={true}
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
                        disabled={true}
                        type="default"
                        icon={<PrinterOutlined />}
                        size="large"
                        style={buttonStyle}
                        onClick={() => this.handlePrint(row)}
                    />
                </Tooltip>
                <Divider
                    type="vertical"
                    style={{ height: '50px', display: 'flex', alignItems: 'center' }}
                />
                                                    <Tooltip title="Delete">
                    <Popconfirm
                        title={`Are you sure you want to delete this?`}
                        onConfirm={() => this.handleDeleteExp(row.EXPENSES_ID)}
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
                                                    )
                                                ),
                                            },

                                        ]}
                                        dataSource={this.state.tableData}
                                        pagination={paginationConfig}
                                        loading={this.state.loading}
                                        // expandedRowRender={(record) => (
                                        //     record.PAYMENTS && record.PAYMENTS.length > 0 ? (
                                        //         <Table
                                        //             size="small"
                                        //             rowKey="TRANSACTION_ID"
                                        //             columns={[
                                        //                 {
                                        //                     title: 'Transaction Code',
                                        //                     dataIndex: 'CODE',
                                        //                 },
                                        //                 {
                                        //                     title: 'Status',
                                        //                     dataIndex: 'STATUS',
                                        //                 },
                                        //                 {
                                        //                     title: 'Date',
                                        //                     dataIndex: 'DATE',
                                        //                     render: (row) => (
                                        //                         <span> {new Date(row).toLocaleDateString()}</span>
                                        //                     ),
                                        //                 },
                                        //                 {
                                        //                     title: 'Method',
                                        //                     dataIndex: 'METHOD'
                                        //                 },
                                        //                 {
                                        //                     title: 'Amount',
                                        //                     dataIndex: 'PAYMENT_AMOUNT'
                                        //                 },
                                        //                 {
                                        //                     title: 'Note',
                                        //                     dataIndex: 'COMMENTS'
                                        //                 },
                                        //             ]
                                        //             }
                                        //             dataSource={record.PAYMENTS}
                                        //             pagination={false}
                                        //         >
                                        //         </Table>
                                        //     ) : null
                                        // )}
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
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

export default CashBook;
