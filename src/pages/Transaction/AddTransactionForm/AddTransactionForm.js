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
  Input, Divider, Switch
} from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import moment from 'moment';
import {RightOutlined} from "@ant-design/icons";

const { Option } = Select;

export default class AddTransactionForm extends Component {

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
      type: 'Selling',

    };
  }

  formRef = React.createRef();



  handleCalculateDueAmount = () => {
    const form = this.formRef.current;
    if (form) {
      const soldAmount = form.getFieldValue('AMOUNT') || 0;
      const amountReceived = form.getFieldValue('AMOUNT_SETTLED') || 0;

      const dueAmount = soldAmount - amountReceived;

      form.setFieldsValue({ DUE_AMOUNT: dueAmount });
    }
  };

  handleCalculateTotal = () => {
    const form = this.formRef.current;
    if (form) {
      const soldAmount = form.getFieldValue('AMOUNT') || 0;
      const sharePercentage = form.getFieldValue('SHARE_PERCENTAGE') || 0;

      const total = soldAmount * sharePercentage / 100;

      form.setFieldsValue({ SHARE_VALUE: total });
    }
  };

  handleTransactionTypeChange = async (value) => {
      const form = this.formRef.current;
      // Reset CUSTOMER and BEARER fields when the transaction type changes
        form.setFieldsValue({ CUSTOMER: undefined });
        form.setFieldsValue({ BEARER: undefined });
      if (value === 'Buying') {
          form.setFieldsValue({STATUS: 'Working'});
      } else if (value === 'Selling') {
          form.setFieldsValue({STATUS: 'Sold'});
      }
      //console.log("type", this.state.type);
  }



  async componentDidMount() {
    // Fetch customer options when the component mounts
    const customerOptions = await this.fetchCustomerOptions();
    this.setState({ customerOptions });
    const ReferenceOptions = await this.fetchReferenceOptions();
    this.setState({ ReferenceOptions });
  }

  async fetchCustomerOptions() {
        try {
            const response = await axios.post("http://localhost:3001/getAllCustomers");
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



  handleReferenceChange = async (value) => {
    //console.log(`selected ${value}`);
    const form = this.formRef.current;
    try {
      const response = await axios.post('http://localhost:3001/getItemsDetailsForTransaction', {
        ITEM_ID_AI: value,
      });
      if (response.data.success) {
        //console.log("response", response);
        form.setFieldsValue({ PAYMENT_ETA_START: response.data.result[0].PAYMENT_ETA_START ? moment(response.data.result[0].PAYMENT_ETA_START) : undefined });
        form.setFieldsValue({ PAYMENT_ETA_END: response.data.result[0].PAYMENT_ETA_END ? moment(response.data.result[0].PAYMENT_ETA_END) : undefined });
        form.setFieldsValue({ DATE_FINISHED: response.data.result[0].DATE_FINISHED ? moment(response.data.result[0].DATE_FINISHED) : undefined });
        form.setFieldsValue({ SHARE_HOLDERS: response.data.result[0].SHARE_HOLDERS ? response.data.result[0].SHARE_HOLDERS.split(',').map(Number): undefined });
        form.setFieldsValue({ SHARE_PERCENTAGE: response.data.result[0].SHARE_PERCENTAGE});
        form.setFieldsValue({ OTHER_SHARES: response.data.result[0].OTHER_SHARES });
        form.setFieldsValue({ COMMENTS: response.data.result[0].COMMENTS });
        if(this.state.type === 'Selling') {
          form.setFieldsValue({AMOUNT: response.data.result[0].SOLD_AMOUNT});
          form.setFieldsValue({AMOUNT_SETTLED: response.data.result[0].AMOUNT_RECEIVED});
          form.setFieldsValue({DUE_AMOUNT: response.data.result[0].DUE_AMOUNT});
          form.setFieldsValue({CUSTOMER: response.data.result[0].BUYER});
          form.setFieldsValue({BEARER: response.data.result[0].BEARER});
        } else if (this.state.type === 'Buying') {
          form.setFieldsValue({AMOUNT: response.data.result[0].COST});
          form.setFieldsValue({AMOUNT_SETTLED: response.data.result[0].GIVEN_AMOUNT});
          form.setFieldsValue({CUSTOMER: response.data.result[0].SELLER});
          form.setFieldsValue({IS_TRANSACTION: response.data.result[0].IS_TRANSACTION ? response.data.result[0].IS_TRANSACTION : false});
        }
      } else {
        message.error('Failed to fetch Item Details');
      }
    } catch (error) {
      console.error("Error fetching reference options:", error);
      return [];
    }
  };



  handleSubmit = async (values) => {
    try {
      // Retrieve USER_ID from rememberedUser
      let rememberedUser = Cookies.get('rememberedUser');
      let USER_ID = null;

      if (rememberedUser) {
        rememberedUser = JSON.parse(rememberedUser);
        USER_ID = rememberedUser.USER_ID;
      }


      // Convert SHARE_HOLDERS to comma-separated string
      const shareHoldersString = Array.isArray(values.SHARE_HOLDERS)
          ? values.SHARE_HOLDERS.join(',')
          : values.SHARE_HOLDERS ? values.SHARE_HOLDERS.toString() : '';


      // Add IS_ACTIVE, CREATED_BY, and SHARE_HOLDERS to the values object
      const updatedValues = {
        ...values,
        IS_ACTIVE: 1,
        CREATED_BY: USER_ID,
        SHARE_HOLDERS: shareHoldersString,
        PAYMENT_AMOUNT: values.AMOUNT_SETTLED,
      };

      //console.log("updatedValues", updatedValues);

      const response = await axios.post('http://localhost:3001/addTransaction', updatedValues);

      if (response.data.success) {
        message.success('Transaction added successfully');

        // You can reset the form if needed
        this.formRef.current.resetFields();

        this.setState({ type: 'Selling' })

      } else {
        message.error('Failed to add Transaction');
      }
    } catch (error) {
      console.error('Error adding Transaction:', error);
      message.error('Internal server error');
    }
  };



  render() {
    const inputStyle = {
      width: '100%',
      height: '30px',
    };

    const {   customerOptions,ReferenceOptions,type } = this.state;

    return (

        <>
          <div className="tabled">
            <Row gutter={[16, 16]} justify="left" align="top">
              <Col xs="24" xl={24}>
                <Card
                    className="criclebox tablespace mb-24"
                    title="Add New Transaction"
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
                            name="TYPE"
                            label="Transaction Type"
                            initialValue="Selling"
                            rules={[{ required: true, message: 'Please select Transaction Type' }]}
                        >
                            <Select
                                placeholder="Select Transaction Type"
                                showSearch
                                onChange={this.handleTransactionTypeChange}
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
                            rules={[{ required: true, message: 'Please select Date' }]}  // Set the default date to today
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

                            rules={[{ required: true, message: 'Please select Reference' }]}
                        >
                          <Select placeholder="Select References" allowClear showSearch onChange={this.handleReferenceChange}
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

                      {type === 'Selling' ?
                          <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item
                                name="CUSTOMER"
                                label="Buyer"
                                rules={[{ required: true, message: 'Please select Customer' }]}
                            >
                              <Select placeholder="Select Customer" allowClear showSearch
                                      filterOption={(input, option) =>
                                          (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                          (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                      }>
                                {this.state.buyerOptions.map((option) => (
                                    <Option key={option.value} value={option.value} title={option.label}>
                                      {option.label}
                                    </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                            :
                          <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item
                                name="CUSTOMER"
                                label="Seller"
                                rules={[{ required: true, message: 'Please select Customer' }]}
                            >
                              <Select placeholder="Select Customer" allowClear showSearch
                                      filterOption={(input, option) =>
                                          (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                          (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                      }>
                                {this.state.sellerOptions.map((option) => (
                                    <Option key={option.value} value={option.value} title={option.label}>
                                      {option.label}
                                    </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                      }

                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name="BEARER" label="Bearer">
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

                    </Row>
                    <Divider />

                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="AMOUNT"
                            label="Amount"
                            rules={[{ required: true, message: 'Please enter Amount' }]}
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Amount" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="AMOUNT_SETTLED"
                            label="Amount Settled"
                            rules={[{ required: true, message: 'Please enter Amount Settled' }]}
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Amount Settled" />
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
                            name="DUE_AMOUNT"
                            label="Due Amount"
                            rules={[{ required: true, message: 'Please enter Due Amount' }]}
                        >
                          <InputNumber style={inputStyle} step={0.01} placeholder="Enter Due Amount" />
                        </Form.Item>
                      </Col>
                      {type === 'Buying' ?
                          <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="IS_TRANSACTION"
                            label="Is Buying Transaction Already Added"
                        >
                          <Switch
                              checkedChildren="Already Added as a Transaction"
                              unCheckedChildren="Not Added as a Transaction"
                              disabled
                          />
                        </Form.Item>
                      </Col>
                        : null}
                      </Row>


                    <Divider/>

                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="PAYMENT_ETA_START"
                            label="Payment ETA - Start"
                        >
                          <DatePicker style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="PAYMENT_ETA_END"
                            label="Payment ETA - End"
                        >
                          <DatePicker style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="DATE_FINISHED"
                            label="Date Finished"
                        >
                          <DatePicker style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col span={9}>
                        <Form.Item name="SHARE_HOLDERS" label="Share Holders">
                          <Select style={inputStyle} placeholder="Select Share Holders" mode="multiple" allowClear showSearch
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
                      <Col xs={24} sm={24} md={24} lg={3}>
                        <Form.Item
                            name="SHARE_PERCENTAGE"
                            label="Share Percentage %"
                        >
                          <InputNumber style={inputStyle} min={0} max={100} placeholder="Enter Share" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={1}>
                        <Form.Item
                            name="SHARE_VALUE_CALCULATE"
                            label=" "
                        >
                          <Button
                              type="default"
                              icon={<RightOutlined />}
                              onClick={this.handleCalculateTotal}
                          >
                          </Button>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={5}>
                        <Form.Item
                            name="SHARE_VALUE"
                            label="Share Value"
                        >
                          <InputNumber style={inputStyle} step={0.01} placeholder="Enter Value" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="OTHER_SHARES"
                            label="Other Shares"
                        >
                          <Input style={inputStyle}  placeholder="Enter Other Shares" />
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
                            Add Transaction
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
