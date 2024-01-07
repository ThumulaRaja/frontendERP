import React, { Component } from 'react';
import {
    Button,
    Card,
    Col,
    Divider,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Row,
    Table,
    Tooltip,
    Typography
} from 'antd';
import axios from 'axios';
import EChart from '../../../../src/components/chart/EChart';
import LineChart from '../../../../src/components/chart/LineChart';
import Paragraph from "antd/lib/typography/Paragraph";
import {DeleteOutlined, EyeOutlined, PrinterOutlined, RightCircleOutlined} from "@ant-design/icons";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import ViewTransactionForm from "../Commen/ViewTransactionForm";

const { Title } = Typography;

class CashDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            countData: [],
            tablePayment: [],
            isUpdateModalVisible: false,
            isViewModalVisible: false,
            selectedItem: null,
        };
        this.toggleViewModal = this.toggleViewModal.bind(this);
        this.handleViewShow = this.handleViewShow.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        this.getAllDueTransactions();
    }

    toggleViewModal() {
        this.setState({
            isViewModalVisible: !this.state.isViewModalVisible,
            selectedItem: null,
        });
    }

    fetchData = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://localhost:3001/getCashDashboardData');

            if (response.data.success) {
                console.log('ResponseDashboard:', response.data.result);
                this.setState({ countData: response.data.result });
            } else {
                console.log('Error:', response.data.message);
            }
        } catch (error) {
            console.log('Error:', error.message);
        } finally {
            this.setState({ loading: false });
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
            const response = await axios.post('http://localhost:3001/deactivateTransaction', {
                TRANSACTION_ID: id,
                ALL: all,
            });

            if (response.data.success) {
                message.success('Transaction deleted successfully');
                // Refresh the table
                await this.getAllCashTransactions();
            } else {
                message.error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            message.error('Internal server error');
        }
    };

    handlePrint = async (row) => {
        console.log('row', row);
        try {
            const response = await axios.post('http://localhost:3001/generateInvoice', {
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


    async getAllDueTransactions() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://localhost:3001/getAllDueTransactions');

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


    renderCountCards = () => {
        const { countData } = this.state;
        if (!countData) return null;

        return (
            <>
                <Card bordered={false} className="circlebox">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                        <Card bordered={false} className="circlebox"
                              style={{
                                  background: 'linear-gradient(to right, #003BACFF, #5D91FFFF)',
                              }}
                        >

                            <div className="number">
                                <Row align="middle" gutter={[24, 0]}>
                                    <Title level={3} style={{ marginBottom: 20,color: '#fff',marginLeft: 20 }}>Cash 💸</Title>
                                </Row>
                                <Row align="middle" gutter={[24, 0]}>
                                    <Col xs={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                marginBottom: '16px',
                                                background: 'linear-gradient(to right, #bbd4fc, #D9DCF8FF)',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
                                                <Title level={3} style={{ color: '#000000' }}> Inflow ➕ </Title>
                                                <span style={{ fontSize: '24px', color: '#313131' }}>Rs {countData.sellCashInTransactions}.00</span>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col xs={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                marginBottom: '16px',
                                                background: 'linear-gradient(to right, #bbd4fc, #D9DCF8FF)',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
                                                <Title level={3} style={{ color: '#000000' }}> Outflow ➖ </Title>
                                                <span style={{ fontSize: '24px', color: '#313131' }}>Rs {countData.buyCashOutTransactions}.00</span>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col xs={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                marginBottom: '16px',
                                                background: 'linear-gradient(to right, #bbd4fc, #D9DCF8FF)',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
                                                <Title level={3} style={{ color: '#000000' }}> Balance 🟰 </Title>
                                                <span style={{ fontSize: '24px', color: '#313131' }}>Rs {countData.cashBalance}.00</span>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                        <Card bordered={false} className="circlebox"
                              style={{
                                  background: 'linear-gradient(to right, #2A7200FF, #5E9D41FF)',
                              }}
                        >

                            <div className="number">
                                <Row align="middle" gutter={[24, 0]}>
                                    <Title level={3} style={{ marginBottom: 20,color: '#fff',marginLeft: 20 }}>Bank 🏛</Title></Row>
                                <Row align="middle" gutter={[24, 0]}>
                                    <Col xs={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                marginBottom: '16px',
                                                background: 'linear-gradient(to right, #c1ffac, #DAFFACFF)',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
                                                <Title level={3} style={{ color: '#000000' }}> Inflow ➕ </Title>
                                                <span style={{ fontSize: '24px', color: '#313131' }}>Rs {countData.sellBankInTransactions}.00</span>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col xs={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                marginBottom: '16px',
                                                background: 'linear-gradient(to right, #c1ffac, #DAFFACFF)',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
                                                <Title level={3} style={{ color: '#000000' }}> Outflow ➖ </Title>
                                                <span style={{ fontSize: '24px', color: '#313131' }}>Rs {countData.buyBankOutTransactions}.00</span>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col xs={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                marginBottom: '16px',
                                                background: 'linear-gradient(to right, #c1ffac, #DAFFACFF)',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
                                                <Title level={3} style={{ color: '#000000' }}> Balance 🟰 </Title>
                                                <span style={{ fontSize: '24px', color: '#313131' }}>Rs {countData.bankBalance}.00</span>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                        <Card bordered={false} className="circlebox"
                              style={{
                                  background: 'linear-gradient(to right, #A81313FF, #A81313CB)',
                              }}
                        >

                            <div className="number">
                                <Row align="middle" gutter={[24, 0]}>
                                    <Title level={3} style={{ marginBottom: 20,color: '#fff',marginLeft: 20 }}>Total Transactions</Title></Row>
                                <Row align="middle" gutter={[24, 0]}>
                                    <Col xs={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                marginBottom: '16px',
                                                background: 'linear-gradient(to right, #fcc8c8, #FCDCC8FF)',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
                                                <Title level={3} style={{ color: '#000000' }}> Total Inflow ➕ </Title>
                                                <span style={{ fontSize: '24px', color: '#313131' }}>Rs {countData.sellBankInTransactions + countData.sellCashInTransactions}.00</span>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col xs={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                marginBottom: '16px',
                                                background: 'linear-gradient(to right, #fcc8c8, #FCDCC8FF)',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
                                                <Title level={3} style={{ color: '#000000' }}> Total Outflow ➖ </Title>
                                                <span style={{ fontSize: '24px', color: '#313131' }}>Rs {countData.buyBankOutTransactions + countData.buyCashOutTransactions}.00</span>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col xs={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                marginBottom: '16px',
                                                background: 'linear-gradient(to right, #fcc8c8, #FCDCC8FF)',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div className="chart-visitor-count">
                                                <Title level={3} style={{ color: '#000000' }}> Total Balance 🟰 </Title>
                                                <span style={{ fontSize: '24px', color: '#313131' }}>Rs {countData.bankBalance + countData.cashBalance}.00</span>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                        <Card bordered={false} className="circlebox">
                            <div className="number">
                                <Row align="middle" gutter={[24, 0]}>
                                    <Col xs={8}>
                                        <Card
                                            bordered
                                            className="circlebox-subcard"
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                marginBottom: '16px',
                                                background: 'linear-gradient(to right, #2F294FFF, #534E6BFF)',
                                                padding: '16px',
                                                flexDirection: 'column',
                                                justifyContent: 'left',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Title level={3} style={{ color: '#fff' }}> Total Expenses 💵</Title>
                                            <span style={{ fontSize: '24px', color: '#fff' }}>Rs {countData.totalExpenses}.00</span>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
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
        const rememberedUser = Cookies.get('rememberedUser');
        let NAME1 = "NO User";

        if (rememberedUser) {
            const parsedUser = JSON.parse(rememberedUser);
            const { USER_ID, NAME } = parsedUser;
            NAME1 = NAME;
            console.log(`User ID: ${USER_ID}, Name: ${NAME}`);
        } else {
            Cookies.remove('rememberedUser');
            window.location.href = '/';
        }

        return (
            <>
                <div className="layout-content">
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                            <Card bordered={false} className="criclebox h-full">
                                <LineChart />
                            </Card>
                        </Col>
                    </Row>
                    <Row className="rowgap-vbox" gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                            {this.renderCountCards()}
                        </Col>
                    </Row>
                    <Row className="rowgap-vbox" gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                            <Card
                                bordered={false}
                                className="criclebox tablespace mb-24"
                                title={
                                    <button
                                        style={{
                                            color: '#FFFFFF',
                                            background: `#be1e1e`,
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '8px 16px',
                                            cursor: 'default',
                                        }}
                                        onClick={() => {}}
                                    >
                                        Due Transactions
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
                                                title: 'Payment ET End Date',
                                                dataIndex: 'PAYMENT_ETA_END',
                                                render: (row) => {
                                                    const rowDate = new Date(row);
                                                    const currentDate = new Date();
                                                    const lateDays = Math.max(0, Math.floor((currentDate - rowDate) / (1000 * 60 * 60 * 24))); // Calculate late days

                                                    return (
                                                        <>
                                                            <div>{rowDate.toLocaleDateString()}</div>
                                                            {/* No of Late Days */}
                                                            <div style={{ color: 'red' }}>{lateDays} {lateDays === 1 ? 'day' : 'days'} late</div>
                                                        </>
                                                    );
                                                },
                                            },

                                            {
                                                title: 'Reference Item',
                                                dataIndex: 'ITEM_CODE',
                                            },
                                            {
                                                title: 'Customer Name',
                                                dataIndex: 'C_NAME',
                                                render: (text, record) => (
                                                    <span>
                <div>{record.C_NAME}</div>
                <div>{record.PHONE_NUMBER}</div>
                <div>({record.COMPANY})</div>
            </span>
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
                        onClick={() => this.handleViewShow(row)}
                    />
                  </Tooltip>
                  {/*<Divider*/}
                  {/*    type="vertical"*/}
                  {/*    style={{ height: '50px', display: 'flex', alignItems: 'center' }}*/}
                  {/*/>*/}
                  {/*                  <Tooltip title="Print">*/}
                  {/*  <Button*/}
                  {/*      type="default"*/}
                  {/*      icon={<PrinterOutlined />}*/}
                  {/*      size="large"*/}
                  {/*      style={buttonStylePrint}*/}
                  {/*      onClick={() => handlePrint(row)}*/}
                  {/*  />*/}
                  {/*</Tooltip>*/}
                  {/*<Divider*/}
                  {/*    type="vertical"*/}
                  {/*    style={{ height: '50px', display: 'flex', alignItems: 'center' }}*/}
                  {/*/>*/}
                  {/*<Tooltip title="Delete">*/}
                  {/*  <Popconfirm*/}
                  {/*      title={`Are you sure you want to delete this ${title}?`}*/}
                  {/*      onConfirm={() => showDeleteAllPaymentsConfirm(row.TRANSACTION_ID)}*/}
                  {/*      okText="Yes"*/}
                  {/*      cancelText="No"*/}
                  {/*  >*/}
{/*    <Button*/}
{/*        danger*/}
{/*        type="primary"*/}
{/*        icon={<DeleteOutlined />}*/}
{/*        size="large"*/}
{/*        style={buttonStyle}*/}
{/*    />*/}
{/*</Popconfirm>*/}
{/*                  </Tooltip>*/}
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
                                            key={this.state.selectedItem.TRANSACTION_ID} // Pass a key to ensure a new instance is created
                                            initialValues={this.state.selectedItem}
                                        />
                                    )}
                                </Modal>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default CashDashboard;
