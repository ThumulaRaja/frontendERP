/* eslint-disable */

import React, { Component } from 'react';
import {
    Card,
    Row,
    Col,
    Form,
    InputNumber,
    Select,
    Switch,
    Button,
    DatePicker,
    Input, Divider, Modal, Table, Tooltip, Popconfirm
} from "antd";
import axios from "axios";
import moment from 'moment';
import {DeleteOutlined, EditOutlined, EyeOutlined, RightOutlined} from "@ant-design/icons";

const { Option } = Select;

class ViewTransactionForm extends Component {
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
            type: this.props.initialValues.TYPE,
        };

    }

    formRef = React.createRef();



    async componentDidMount() {
        // Fetch customer options when the component mounts
        const customerOptions = await this.fetchCustomerOptions();
        this.setState({ customerOptions });
        const ReferenceOptions = await this.fetchReferenceOptions();
        this.setState({ ReferenceOptions });
        //console.log("initialValues", this.props.initialValues);
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

    async fetchReferenceOptions() {
        try {
            const response = await axios.post("http://35.154.1.99:3001/getItemsForReference");
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


    render() {
        const inputStyle = {
            width: '100%',
            pointerEvents: "none", // Disable pointer events to prevent interaction
            background: "#ffffff", // Set a background color to indicate it's style={inputStyle}
            color: "#000000", // Set a text color to indicate it's not editable
        };

        const {   customerOptions,ReferenceOptions,type } = this.state;

        return (

            <>
                <div className="tabled">
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <Card
                                className="criclebox tablespace mb-24"
                                title={this.props.initialValues.CODE}
                            >
                                <Form
                                    layout="vertical"
                                    style={{ margin: '20px' }}
                                    ref={this.formRef}
                                >
                                    <Row gutter={[16, 16]} justify="left" align="top">
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            {/* Gem Type */}
                                            <Form.Item
                                                name="TYPE"
                                                label="Transaction Type"
                                                initialValue={this.props.initialValues.TYPE}
                                                rules={[{ required: true, message: 'Please select Transaction Type' }]}
                                            >
                                                <Select
                                                    placeholder="Select Transaction Type"
                                                    showSearch
                                                    style={inputStyle}
                                                >
                                                    <Option value="Selling">Selling</Option>
                                                    <Option value="Buying">Buying</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            {/* Gem Type */}
                                            <Form.Item
                                                name="METHOD"
                                                label="Transaction Method"
                                                initialValue={this.props.initialValues.METHOD}
                                                rules={[{ required: true, message: 'Please select Transaction Method' }]}
                                            >
                                                <Select
                                                    placeholder="Select Transaction Method"
                                                    showSearch
                                                    style={inputStyle}
                                                >
                                                    <Option value="Cash">Cash</Option>
                                                    <Option value="Bank">Bank</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            {/* Status */}
                                            <Form.Item
                                                name="STATUS"
                                                label="Change status to"
                                                initialValue={this.props.initialValues.STATUS}
                                                rules={[{ required: true, message: 'Please select Status' }]}
                                            >
                                                <Select style={inputStyle} placeholder="Select Status" showSearch>
                                                    <Option value="Working">Working</Option>
                                                    <Option value="Treatment">Treatment</Option>
                                                    <Option value="Sold">Sold</Option>
                                                    <Option value="Finished">Finished</Option>
                                                    <Option value="Stuck">Stuck</Option>
                                                    <Option value="With Sales Person">With Sales Person</Option>
                                                    <Option value="Cutting">Cutting</Option>
                                                    <Option value="Ready for Selling">Ready for Selling</Option>
                                                    <Option value="Heat Treatment">Heat Treatment</Option>
                                                    <Option value="Electric Treatment">Electric Treatment</Option>
                                                    <Option value="C&P">C&P</Option>
                                                    <Option value="Preformed">Preformed</Option>
                                                    <Option value="Added to a lot">Added to a lot</Option>
<Option value="With Heat T">With Heat T</Option>
<Option value="With C&P">With C&P</Option>
<Option value="With Electric T">With Electric T</Option>
                                <Option value="With Preformer">With Preformer</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            {/* Date */}
                                            <Form.Item
                                                name="DATE"
                                                label="Date"
                                                initialValue={this.props.initialValues.DATE ? moment(this.props.initialValues.DATE) : null}
                                                rules={[
                                                    { required: true, message: 'Please enter Date' },
                                                ]}
                                            >
                                                <DatePicker style={inputStyle} />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={12} md={12} lg={12}>
                                            <Form.Item
                                                name="REFERENCE"
                                                label="Reference"
                                                initialValue={this.props.initialValues.REFERENCE}
                                                rules={[{ required: true, message: 'Please select Reference' }]}
                                            >
                                                <Select placeholder="Select References" allowClear showSearch  style={inputStyle}
                                                        filterOption={(input, option) =>
                                                            (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                                            (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                                        }>
                                                    {ReferenceOptions.map((option) => (
                                                        <Option key={option.value} value={option.value} title={option.label}>
                                                            {option.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="CUSTOMER"
                                                label={this.props.initialValues.TYPE === 'Selling' ? "Buyer" : "Seller"}
                                                initialValue={this.props.initialValues.CUSTOMER}
                                            >
                                                <Select placeholder="Select Customer" allowClear showSearch  style={inputStyle}
                                                        filterOption={(input, option) =>
                                                            (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                                            (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                                        }>
                                                    {customerOptions.map((option) => (
                                                        <Option key={option.value} value={option.value} title={option.label}>
                                                            {option.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        {this.props.initialValues.TYPE === 'Selling' ?
                                            <Col xs={24} sm={12} md={8} lg={6}>
                                                <Form.Item name="BEARER" label="Bearer" initialValue={this.props.initialValues.BEARER}>
                                                    <Select style={inputStyle} placeholder="Select Bearer" allowClear showSearch
                                                            filterOption={(input, option) =>
                                                                (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                                                (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                                            }>
                                                        {this.state.salesPersonOptions.map((option) => (
                                                            <Option key={option.value} value={option.value} title={option.label}>
                                                                {option.label}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            : null}

                                    </Row>
                                    <Divider />

                                    <Row gutter={[16, 16]} justify="left" align="top">
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="AMOUNT"
                                                label="Amount"
                                                initialValue={this.props.initialValues.AMOUNT}
                                                rules={[{ required: true, message: 'Please enter Amount' }]}
                                            >
                                                <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Amount" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="PAYMENT_AMOUNT"
                                                label="Payment Amount"
                                                initialValue={this.props.initialValues.PAYMENT_AMOUNT}
                                                rules={[{ required: true, message: 'Please enter Amount' }]}
                                            >
                                                <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Payment Amount" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="AMOUNT_SETTLED"
                                                label="Amount Settled"
                                                initialValue={this.props.initialValues.AMOUNT_SETTLED}
                                                rules={[{ required: true, message: 'Please enter Amount Settled' }]}
                                            >
                                                <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Amount Settled" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="DUE_AMOUNT"
                                                label="Due Amount"
                                                initialValue={this.props.initialValues.DUE_AMOUNT}
                                                rules={[{ required: true, message: 'Please enter Due Amount' }]}
                                            >
                                                <InputNumber style={inputStyle} step={0.01} placeholder="Enter Due Amount" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Divider />

                                    {this.props.initialValues.TYPE === 'Selling' || this.props.initialValues.TYPE === 'Buying' ?
                                    <Row gutter={[16, 16]} justify="left" align="top">
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="PAYMENT_ETA_START"
                                                label="Payment ETA - Start"
                                                initialValue={this.props.initialValues.PAYMENT_ETA_START ? moment(this.props.initialValues.PAYMENT_ETA_START) : null}
                                            >
                                                <DatePicker style={inputStyle} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="PAYMENT_ETA_END"
                                                label="Payment ETA - End"
                                                initialValue={this.props.initialValues.PAYMENT_ETA_END ? moment(this.props.initialValues.PAYMENT_ETA_END) : null}
                                            >
                                                <DatePicker style={inputStyle} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="DATE_FINISHED"
                                                label="Date Finished"
                                                initialValue={this.props.initialValues.DATE_FINISHED ? moment(this.props.initialValues.DATE_FINISHED) : null}
                                            >
                                                <DatePicker style={inputStyle} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={9}>
                                            <Form.Item name="SHARE_HOLDERS" label="Share Holders"
                                                       initialValue={
                                                           this.props.initialValues.SHARE_HOLDERS
                                                               ? this.props.initialValues.SHARE_HOLDERS.split(',').map(Number)
                                                               : undefined
                                                       }>
                                                <Select style={inputStyle} placeholder="Select Share Holders" mode="multiple" showSearch>
                                                    {this.state.partnerOptions.map((option) => (
                                                        <Option key={option.value} value={option.value} title={option.label}>
                                                            {option.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={3}>
                                            <Form.Item
                                                name="SHARE_PERCENTAGE"
                                                label="Share Percentage %"
                                                initialValue={this.props.initialValues.SHARE_PERCENTAGE}
                                            >
                                                <InputNumber style={inputStyle} min={0} max={100} placeholder="Enter Share" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="SHARE_VALUE"
                                                label="Share Value"
                                                initialValue={this.props.initialValues.SHARE_VALUE}
                                            >
                                                <InputNumber style={inputStyle} step={0.01} placeholder="Enter Value" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="OTHER_SHARES"
                                                label="Other Shares"
                                                initialValue={this.props.initialValues.OTHER_SHARES}
                                            >
                                                <Input style={inputStyle}  placeholder="Enter Other Shares" />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={24} md={24} lg={24}>
                                            <Form.Item
                                                name="COMMENTS"
                                                label="Comments"
                                                initialValue={this.props.initialValues.COMMENTS}
                                            >
                                                <Input.TextArea rows={2} placeholder="Enter comments" style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    : null}

                                </Form>
                            </Card>
                            {/*

                */}
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default ViewTransactionForm;
