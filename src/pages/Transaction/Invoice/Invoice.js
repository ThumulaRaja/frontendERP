import React, { Component } from "react";
import {
    Card,
    Row,
    Col,
    Form,
    InputNumber,
    Select,
    Button,
    message,
    DatePicker,
    Divider,
    Input,
    Switch
} from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import moment from 'moment';
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

export default class Invoice extends Component {

    constructor(props) {
        super(props);
        this.state = {

            customerOptions: [],
            buyerOptions: [],
            sellerOptions: [],
            salesPersonOptions: [],
            partnerOptions: [],
            htByOptions: [],
            cpByOptions: [],
            preformerOptions: [],
            etByOptions: [],
            ReferenceOptions: [],
            TransactionOptions: [],
            type: 'Selling',
            referenceRows: [
                {
                    id: uuidv4(),
                },
            ],
        };
    }
    formRef = React.createRef();

    async componentDidMount() {
        // Fetch customer options when the component mounts
        const customerOptions = await this.fetchCustomerOptions();
        this.setState({ customerOptions });
        const ReferenceOptions = await this.fetchReferenceOptions();
        this.setState({ ReferenceOptions });
        const TransactionOptions = await this.fetchTransactionOptions();
        this.setState({ TransactionOptions });
    }


    async fetchCustomerOptions() {
        try {
            const response = await axios.post("http://localhost:3001/getAllCustomers");
            //console.log("response", response);

            // BuyerOptions Filter TYPE = Buyer
            const buyerOptions = response.data.result.filter((customer) => customer.TYPE === 'Buyer').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }));

            // SellerOptions Filter TYPE = Seller
            const sellerOptions = response.data.result.filter((customer) => customer.TYPE === 'Seller').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }));

            // SalesPersonOptions Filter TYPE = Sales Person
            const salesPersonOptions = response.data.result.filter((customer) => customer.TYPE === 'Sales Person').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }));

            // PartnerOptions Filter TYPE = Partner
            const partnerOptions = response.data.result.filter((customer) => customer.TYPE === 'Partner').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }));

            // HTByOptions Filter TYPE = HT By
            const htByOptions = response.data.result.filter((customer) => customer.TYPE === 'Heat T').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }));

            // CPByOptions Filter TYPE = CP By
            const cpByOptions = response.data.result.filter((customer) => customer.TYPE === 'C&P').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }));

            // PreformerOptions Filter TYPE = Preformer
            const preformerOptions = response.data.result.filter((customer) => customer.TYPE === 'Preformer').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }));

            // ETByOptions Filter TYPE = Electric
            const etByOptions = response.data.result.filter((customer) => customer.TYPE === 'Electric').map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
            }));

            this.setState({ buyerOptions, sellerOptions, salesPersonOptions, partnerOptions, htByOptions, cpByOptions, preformerOptions, etByOptions });

            return response.data.result.map((customer) => ({
                value: customer.CUSTOMER_ID,
                label: customer.NAME,
                type: customer.TYPE
            }));
        } catch (error) {
            console.error("Error fetching customer options:", error);
            return [];
        }
    }

    async fetchReferenceOptions() {
        try {
            const response = await axios.post("http://localhost:3001/getItemsForReference");
            //console.log("response", response);
            return response.data.result.map((ref) => ({
                value: ref.ITEM_ID_AI,
                label: ref.CODE,
            }));
        } catch (error) {
            console.error("Error fetching reference options:", error);
            return [];
        }
    }

    async fetchTransactionOptions() {
        try {
            const response = await axios.post("http://localhost:3001/getAllTransactionForReference");
            //console.log("response", response);
            return response.data.result.map((transaction) => ({
                value: transaction.TRANSACTION_ID,
                label: transaction.CODE,
                ref: transaction.ITEM_CODE,
            }));
        } catch (error) {
            console.error("Error fetching reference options:", error);
            return [];
        }
    }


    handleTransactionChange = async (value, rowId) => {
        const form = this.formRef.current;
        //console.log("value", value);
        //console.log("rowId", rowId);
        try {
            const response = await axios.post('http://localhost:3001/getTransactionDetails', {
                TRANSACTION_ID: value,
            });
            if (response.data.success) {
                //console.log("response", response);

                // Use square bracket notation for dynamic field names
                form.setFieldsValue({ [`REFERENCE_${rowId}`]: response.data.result[0].REFERENCE});
                form.setFieldsValue({ [`AMOUNT_${rowId}`]: response.data.result[0].AMOUNT });
            } else {
                message.error('Failed to fetch Item Details');
            }
        } catch (error) {
            console.error("Error fetching reference options:", error);
            return [];
        }
    }


    handleAddRow = () => {
        this.setState((prevState) => ({
            referenceRows: [
                ...prevState.referenceRows,
                {
                    id: uuidv4(),
                },
            ],
        }));
    };

    handleDeleteRow = (rowId) => {
        if (this.state.referenceRows.length > 1) {
            this.setState((prevState) => ({
                referenceRows: prevState.referenceRows.filter((row) => row.id !== rowId),
            }));
        }
    };

    renderReferenceRows() {
        const { referenceRows } = this.state;

        return referenceRows.map((row, index) => (
            <React.Fragment key={row.id}>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Gem Type */}
                        <Form.Item
                            name={`TRANSACTION_${row.id}`}
                            label={`Transaction Code ${index + 1}`}
                        >
                            <Select
                                placeholder="Select Transaction Code"
                                showSearch
                                style={{ width: '100%' }}
                                onChange={(value) => this.handleTransactionChange(value, row.id)}
                                filterOption={(input, option) =>
                                    (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                    (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                }>
                                >
                                {this.state.TransactionOptions.map((option) => (
                                    <Option key={option.value} value={option.value} title={option.label} >
                                        {option.label}  ({option.ref})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={12} lg={6}>
                        <Form.Item
                            name={`REFERENCE_${row.id}`}
                            label={`Reference ${index + 1}`}
                            rules={[{ required: true, message: 'Please select Reference' }]}
                        >
                            <Select
                                placeholder="Select References"
                                allowClear
                                showSearch
                                style={{ width: '100%' }}
                                filterOption={(input, option) =>
                                    (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                    (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                }>
                                {this.state.ReferenceOptions.map((option) => (
                                    <Option key={option.value} value={option.value} title={option.label}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6}>
                        <Form.Item
                            name={`AMOUNT_${row.id}`}
                            label={`Amount ${index + 1}`}
                            rules={[{ required: true, message: 'Please enter Amount' }]}
                        >
                            <InputNumber min={0} step={0.01} placeholder="Enter Amount" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>


                    <Col xs={12} sm={12} md={12} lg={1}>
                        <Form.Item
                            label=" "
                            name={`DELETE_ROW_${row.id}`}
                        >
                            {this.state.referenceRows.length > 1 && (
                                <Button
                                    type="primary"
                                    danger
                                    icon={<MinusOutlined />}
                                    onClick={() => this.handleDeleteRow(row.id)}
                                />
                            )}
                        </Form.Item>
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={1}>
                        <Form.Item
                            label=" "
                            name={`ADD_ROW_${row.id}`}
                        >
                            {this.state.referenceRows.length < 15 && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={this.handleAddRow}
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        ));
    }

    handleSubmit = async (values) => {
        try {
            const updatedValues = {
                CUSTOMER: values.CUSTOMER,
                DATE: values.DATE.format('YYYY-MM-DD'),
                NO_OF_ROWS: this.state.referenceRows.length,
                //GET TOTAL_AMOUNT from all rows Amount Collect as Number and then add
                TOTAL_AMOUNT: this.state.referenceRows.reduce((total, row) => total + Number(values[`AMOUNT_${row.id}`] || 0), 0),
                ROW_TRANSACTIONS: this.state.referenceRows.map((row) => ({
                        REFERENCE: values[`REFERENCE_${row.id}`],
                        AMOUNT: values[`AMOUNT_${row.id}`],
                    }
                )),
            }
            const response = await axios.post('http://localhost:3001/generateInvoiceByGenerator', {
                data: updatedValues,
            });

            if (response.data.success) {
                const blob = new Blob([new Uint8Array(atob(response.data.data).split('').map(char => char.charCodeAt(0)))], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                // Removed the line that sets the 'download' attribute
                link.target = '_blank'; // This line makes it open in a new tab
                link.click();
                //Reset all Fields
                this.formRef.current.resetFields();
            } else {
                console.error('Error generating invoice:', response.data.message);
                // Handle error, e.g., display an error message
            }
        } catch (error) {
            console.error('Error generating invoice:', error.message);
            // Handle error, e.g., display an error message
        }
    };

    render() {
        const { customerOptions, ReferenceOptions, TransactionOptions, type } = this.state;

        const inputStyle = {
            width: '100%',
            pointerEvents: "none", // Disable pointer events to prevent interaction
            background: "#f0f0f0", // Set a background color to indicate it's style={inputStyle}
            color: "#000000"
        };


        return (

            <>
                <div className="tabled">
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <Card
                                className="criclebox tablespace mb-24"
                                title="Invoice"
                            >
                                <Form
                                    layout="vertical"
                                    onFinish={this.handleSubmit}
                                    style={{ margin: '20px' }}
                                    ref={this.formRef}
                                >
                                    <Row gutter={[16, 16]} justify="left" align="top">
                                        <Col xs={24} sm={12} md={8} lg={12}>
                                            <Form.Item
                                                name="CUSTOMER"
                                                label="Customer"
                                            >
                                                <Select placeholder="Select Customer" allowClear showSearch
                                                        filterOption={(input, option) =>
                                                            (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                                            (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                                        }>
                                                    {customerOptions.filter((customer) => customer.type === 'Buyer' || customer.type === 'Seller').map((option) => (
                                                        <Option key={option.value} value={option.value} title={option.label}>
                                                            {option.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={12}>
                                            {/* Date */}
                                            <Form.Item
                                                name="DATE"
                                                label="Date"
                                                rules={[{ required: true, message: 'Please select Date' }]}  // Set the default date to today
                                                rules={[
                                                    { required: true, message: 'Please enter Date' },
                                                ]}
                                            >
                                                <DatePicker style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>

                                    </Row>
                                    <Divider />
                                        {this.renderReferenceRows()}
                                    <Divider />

                                    <Row gutter={[16, 16]} justify="left" align="top">
                                        <Col xs={24} sm={24} md={24} lg={24}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Generate Invoice
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}
