// /* eslint-disable */
import React, {Component} from "react";
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
  Divider, Input
} from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import moment from 'moment';
import {RightOutlined} from "@ant-design/icons";

const { Option } = Select;

export default class AddPaymentsForm extends Component {

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
      ReferenceOptions: [],
      TransactionOptions: [],
      type: 'Selling',

    };
  }
  formRef = React.createRef();
  handleCalculateDueAmount = () => {
    const form = this.formRef.current;
    if (form) {
      const currentDueAmount = form.getFieldValue('DUE_AMOUNT') || 0;
      const paymentAmount = form.getFieldValue('PAYMENT_AMOUNT') || 0;

      const newDueAmount = currentDueAmount - paymentAmount;

      form.setFieldsValue({ DUE_AMOUNT_AFTER_PAYMENT: newDueAmount });
    }
  };


  async componentDidMount() {
    // Fetch customer options when the component mounts
    const customerOptions = await this.fetchCustomerOptions();
    this.setState({ customerOptions });
    const ReferenceOptions = await this.fetchReferenceOptions();
    this.setState({ ReferenceOptions });
    const TransactionOptions = await this.fetchTransactionOptions();
    this.setState({ TransactionOptions });
  }

  handleTransactionTypeChange = (value) => {
    const form = this.formRef.current;
    this.setState({ type: value });
    if (value === 'Buying') {
      form.setFieldsValue({ STATUS: 'Working' });
    }
    else if (value === 'Selling') {
      form.setFieldsValue({ STATUS: 'Sold' });
    }
  }

  async fetchCustomerOptions() {
        try {
            const response = await axios.post("http://35.154.1.99:3001/getAllCustomers");
            console.log("response", response);

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

            this.setState({ buyerOptions, sellerOptions, salesPersonOptions, partnerOptions, htByOptions, cpByOptions, preformerOptions });

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
      console.log("response", response);
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
      const response = await axios.post("http://35.154.1.99:3001/getTransactionForReference");
      console.log("response", response);
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


    handleTransactionChange = async (value) => {
      const form = this.formRef.current;
      try {
        const response = await axios.post('http://35.154.1.99:3001/getTransactionDetails', {
          TRANSACTION_ID: value,
        });
        if (response.data.success) {
          console.log("response", response);
          form.setFieldsValue({ TYPE: response.data.result[0].TYPE });
            form.setFieldsValue({ METHOD: response.data.result[0].METHOD });
            form.setFieldsValue({ STATUS: response.data.result[0].STATUS });
            form.setFieldsValue({ REFERENCE: response.data.result[0].REFERENCE });
            form.setFieldsValue({ CUSTOMER: response.data.result[0].CUSTOMER });
            form.setFieldsValue({ BEARER: response.data.result[0].BEARER });
            form.setFieldsValue({ AMOUNT: response.data.result[0].AMOUNT });
            form.setFieldsValue({ AMOUNT_SETTLED: response.data.result[0].AMOUNT_SETTLED });
            form.setFieldsValue({ DUE_AMOUNT: response.data.result[0].DUE_AMOUNT });
            form.resetFields(['DUE_AMOUNT_AFTER_PAYMENT']);

          this.handleTransactionTypeChange(response.data.result[0].TYPE);
        } else {
          message.error('Failed to fetch Item Details');
        }
      } catch (error) {
        console.error("Error fetching reference options:", error);
        return [];
      }
    }



  handleSubmit = async (values) => {
    try {
      // Retrieve USER_ID from rememberedUser
      let rememberedUser = Cookies.get('rememberedUser');
      let USER_ID = null;

      if (rememberedUser) {
        rememberedUser = JSON.parse(rememberedUser);
        USER_ID = rememberedUser.USER_ID;
      }

      // Add IS_ACTIVE, CREATED_BY, and SHARE_HOLDERS to the values object
      const updatedValues = {
        ...values,
        IS_ACTIVE: 1,
        CREATED_BY: USER_ID,
      };

      console.log("updatedValues", updatedValues);

      const response = await axios.post('http://35.154.1.99:3001/addPayment', updatedValues);

      if (response.data.success) {
        message.success('Payment added successfully');

        // You can reset the form if needed
        this.formRef.current.resetFields();

      } else {
        message.error('Failed to add Payment');
      }
    } catch (error) {
      console.error('Error adding Payment:', error);
      message.error('Internal server error');
    }
  };



  render() {
    const {   customerOptions,ReferenceOptions,TransactionOptions,type } = this.state;

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
                    title="Add New Payment"
                >
                  <Form
                      layout="vertical"
                      onFinish={this.handleSubmit}
                      style={{ margin: '20px' }}
                      ref={this.formRef}
                  >
                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Gem Type */}
                        <Form.Item
                            name="TRANSACTION"
                            label="Transaction Code"
                            rules={[{ required: true, message: 'Please select Transaction Code' }]}
                        >
                            <Select
                                placeholder="Select Transaction Code"
                                showSearch
                                onChange={this.handleTransactionChange}
                                filterOption={(input, option) =>
                                    (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                    (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                }>
                            >
                              {TransactionOptions.map((option) => (
                                  <Option key={option.value} value={option.value} title={option.label} >
                                    {option.label}  ({option.ref})
                                  </Option>
                              ))}
                            </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={24} lg={3}>
                        {/* Gem Type */}
                        <Form.Item
                            name="TYPE"
                            label="Transaction Type"
                            initialValue="Selling"
                            rules={[{ required: true, message: 'Please select Transaction Type' }]}
                        >
                          <Select
                              placeholder="Select Transaction Type"
                              showSearch
                              onChange={this.handleTransactionTypeChange}
                              style={inputStyle}
                              mode="tags"
                          >
                            <Option value="Selling">Selling</Option>
                            <Option value="Buying">Buying</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={24} lg={3}>
                        {/* Gem Type */}
                        <Form.Item
                            name="METHOD"
                            label="Method"
                            initialValue="Cash"
                            rules={[{ required: true, message: 'Please select Transaction Method' }]}
                        >
                          <Select
                              placeholder="Select Transaction Method"
                              showSearch
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
                            initialValue="Sold"
                            rules={[{ required: true, message: 'Please select Status' }]}
                        >
                            <Select placeholder="Select Status" showSearch>
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

                      <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Date */}
                        <Form.Item
                            name="DATE"
                            label="Date"
                            initialValue={moment()}  // Set the default date to today
                            rules={[
                              { required: true, message: 'Please enter Date' },
                            ]}
                        >
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                            name="REFERENCE"
                            label="Reference"

                            rules={[{ required: true, message: 'Please select Reference' }]}
                        >
                          <Select placeholder="Select References" allowClear showSearch style={inputStyle} mode="tags"
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
                            label="Customer"
                        >
                          <Select placeholder="Select Customer" allowClear showSearch
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
                      {type === 'Selling' ?
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name="BEARER" label="Bearer">
                          <Select placeholder="Select Bearer" allowClear showSearch
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
                            rules={[{ required: true, message: 'Please enter Amount' }]}
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Amount"/>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="AMOUNT_SETTLED"
                            label="Amount Settled"
                            rules={[{ required: true, message: 'Please enter Amount Settled' }]}
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Amount Settled"/>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="DUE_AMOUNT"
                            label="Due Amount"
                            rules={[{ required: true, message: 'Please enter Due Amount' }]}
                        >
                          <InputNumber style={inputStyle} step={0.01} placeholder="Enter Due Amount"/>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="PAYMENT_AMOUNT"
                            label="Payment Amount"
                            rules={[{ required: true, message: 'Please enter Payment Amount' }]}
                        >
                          <InputNumber step={0.01} placeholder="Enter Payment Amount" style={{ width : '100%' }}/>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={1}>
                        <Form.Item
                            label=" "
                            name="CALCULATE_DUE_AMOUNT"
                        >
                          <Button
                              type="default"
                              icon={<RightOutlined />}
                              onClick={this.handleCalculateDueAmount}
                          >
                          </Button>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={5}>
                        <Form.Item
                            name="DUE_AMOUNT_AFTER_PAYMENT"
                            label="Due Amount After Payment"
                            rules={[{ required: true, message: 'Please enter Due Amount After Payment' }]}
                        >
                          <InputNumber step={0.01} placeholder="Enter Due Amount After Payment" style={{ width : '100%' }}/>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                            name="COMMENTS"
                            label="Comments"
                        >
                          <Input.TextArea rows={2} placeholder="Enter comments" />
                        </Form.Item>
                      </Col>
                    </Row>


                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Add Payment
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
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
