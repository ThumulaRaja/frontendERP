/* eslint-disable */

import React, {Component} from "react";
import {
  Card,
  Row,
  Col,
  Form,
  InputNumber,
  Select,
  Switch,
  Upload,
  Button,
  message,
  DatePicker,
  Input, Divider, Modal, Space
} from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import moment from 'moment';
import {RightOutlined, UploadOutlined} from "@ant-design/icons";

const { Option } = Select;

export default class AddItemsForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHeatTreated: false,
        isElectricTreated: false,
      isTransaction: true,
      fileList: [],
      gemType: 'Rough',
      customerOptions: [],
      buyerOptions: [],
      sellerOptions: [],
      salesPersonOptions: [],
      partnerOptions: [],
      htByOptions: [],
      cpByOptions: [],
      preformerOptions: [],
        etByOptions: [],
      heatTreatmentGroupOptions: [],
      ReferenceOptions: [],

      fileList1: [],  // For the first photo uploader
      previewVisible1: false,
      previewImage1: '',
      imgBBLink1: '',  // To store the link of the uploaded image

      fileList2: [],  // For the second photo uploader
      previewVisible2: false,
      previewImage2: '',
      imgBBLink2: '',

        fileList3: [],  // For the second photo uploader
        previewVisible3: false,
        previewImage3: '',
        imgBBLink3: '',
    };
  }

  formRef = React.createRef();



  handleCalculateDueAmount = () => {
    const form = this.formRef.current;
    if (form) {
      const soldAmount = form.getFieldValue('SOLD_AMOUNT') || 0;
      const amountReceived = form.getFieldValue('AMOUNT_RECEIVED') || 0;

      const dueAmount = soldAmount - amountReceived;

      form.setFieldsValue({ DUE_AMOUNT: dueAmount });
    }
  };



  handleFileChange = async ({ fileList }, uploaderNumber) => {
    try {
      this.setState({ [`fileList${uploaderNumber}`]: fileList, fileList: [] }); // Clear the general fileList

      if (fileList.length > 0) {
        const imgFile = fileList[0].originFileObj;

        if (imgFile) {
          const formData = new FormData();
          formData.append('image', imgFile);

          const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: {
              key: 'a94bb5679f1add2d50baee0220cc7926', // Replace with your ImgBB API key
            },
          });

          const imgBBLinkKey = `imgBBLink${uploaderNumber}`;
          this.setState({ [imgBBLinkKey]: response.data.data.url });
          //console.log('Image uploaded to ImgBB:', response);
          //show success message if response is success
            if (response.data.success) {
                message.success('Image uploaded successfully');
            }
            //show not success message if response is not success
            else {
                message.error('Failed to upload Image');
            }

          //console.log('this.state', this.state);
        }
      }
    } catch (error) {
      // Log the error to the console for debugging
      console.error('Error in handleFileChange:', error);

      // Handle specific errors if needed
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('ImgBB API Error:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from ImgBB API');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error in request setup:', error.message);
      }
    }
  };

  handleSwitchChange = (checked) => {
    this.setState({ isHeatTreated: checked });
  }

    handleSwitchChangeET = (checked) => {
        this.setState({ isElectricTreated: checked });
    }

    handleSwitchChangeTR = (checked) => {
     this.setState({ isTransaction: checked });
    }

  async componentDidMount() {
    // Fetch customer options when the component mounts
    const customerOptions = await this.fetchCustomerOptions();
    this.setState({ customerOptions });
    const heatTreatmentGroupOptions = await this.fetchHTGroupOptions();
    this.setState({ heatTreatmentGroupOptions });
    const ReferenceOptions = await this.fetchReferenceOptions();
    this.setState({ ReferenceOptions });
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
      console.error("Error fetching refererance options:", error);
      return [];
    }
  }

  async fetchHTGroupOptions() {
    try {
      const response = await axios.post("http://35.154.1.99:3001/getAllHT");
      //console.log("response", response);
      return response.data.result.map((ht) => ({
        value: ht.HT_ID,
        code: ht.CODE,
          type: ht.TYPE,
      }));
    } catch (error) {
      console.error("Error fetching Treatment Group Options:", error);
      return [];
    }
  }


  handleGemTypeChange = (gemType) => {
    this.setState({ gemType });
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

      const referenceString = Array.isArray(values.REFERENCE_ID_LOTS)
          ? values.REFERENCE_ID_LOTS.join(',')
          : values.REFERENCE_ID_LOTS ? values.REFERENCE_ID_LOTS.toString() : '';

      const policyString = Array.isArray(values.POLICY)
          ? values.POLICY.join(',')
          : values.POLICY ? values.POLICY.toString() : '';

      // Add IS_ACTIVE, CREATED_BY, and SHARE_HOLDERS to the values object
      const updatedValues = {
        ...values,
        IS_ACTIVE: 1,
        CREATED_BY: USER_ID,
        PHOTO_LINK: this.state.imgBBLink2,
        PHOTOS_AFTER_HT_LINK: this.state.imgBBLink1,
          PHOTOS_AFTER_ET_LINK: this.state.imgBBLink3,
        SHARE_HOLDERS: shareHoldersString,
        REFERENCE_ID_LOTS: referenceString,
        IS_TRANSACTION: this.state.isTransaction,
        IS_HEAT_TREATED: this.state.isHeatTreated,
        POLICY: policyString,
      };

      //console.log("updatedValues", updatedValues);

      const response = await axios.post('http://35.154.1.99:3001/addItem', updatedValues);

      if (response.data.success) {
        message.success('Item added successfully');

        // You can reset the form if needed
        this.formRef.current.resetFields();

        this.setState({
          fileList2: [],           // Clear the fileList
          previewVisible2: false, // Hide the preview modal
          imgBBLink2: '',          // Reset the image link
          fileList1: [],           // Clear the fileList
          previewVisible1: false, // Hide the preview modal
            previewVisible3: false, // Hide the preview modal
          imgBBLink1: '',          // Reset the image link
          gemType: 'Rough',
        });

      } else {
        message.error('Failed to add Item');
      }
    } catch (error) {
      console.error('Error adding Item:', error);
      message.error('Internal server error');
    }
  };



  render() {
    const inputStyle = {
      width: '100%',
      height: '30px',
    };

    const {  gemType, customerOptions,heatTreatmentGroupOptions,fileList1,fileList2,fileList3,ReferenceOptions } = this.state;

    const fileLimit = {
      accept: 'image/*', // Accept only image files
    };



    return (

        <>
          <div className="tabled">
            <Row gutter={[16, 16]} justify="left" align="top">
              <Col xs="24" xl={24}>
                <Card
                    className="criclebox tablespace mb-24"
                    title="Add New Item"
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
                            label="Gem Type"
                            initialValue="Rough"
                            rules={[{ required: true, message: 'Please select Gem Type' }]}
                        >
                            <Select
                                placeholder="Select Gem Type"
                                onChange={this.handleGemTypeChange}
                                showSearch
                            >
                              <Option value="Rough">Rough</Option>
                              <Option value="Lots">Lots</Option>
                              <Option value="Sorted Lots">Sorted Lots</Option>
                              <Option value="Cut and Polished">Cut and Polished</Option>
                            </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Status */}
                        <Form.Item
                            name="STATUS"
                            label="Status"
                            initialValue="Working"
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
                      {/*<Col xs={24} sm={12} md={8} lg={6}>*/}
                      {/*  /!* No of Pieces *!/*/}
                      {/*  <Form.Item*/}
                      {/*      name="ITEM_ID"*/}
                      {/*      label="Item ID"*/}
                      {/*      type="number"*/}
                      {/*      rules={[*/}
                      {/*        { required: true, message: 'Please enter Item ID' },*/}
                      {/*      ]}*/}
                      {/*  >*/}
                      {/*      <InputNumber style={inputStyle}  placeholder="Enter ID" />*/}
                      {/*  </Form.Item>*/}
                      {/*</Col>*/}

                      <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Weight (ct) */}
                        <Form.Item
                            name="WEIGHT"
                            label="Weight (ct)"
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Weight" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={6}>
                        {/* No of Pieces */}
                        <Form.Item
                            name="PIECES"
                            label="No of Pieces"
                            type="number"

                        >
                            <InputNumber style={inputStyle} min={0} placeholder="Enter Pieces" />
                        </Form.Item>
                      </Col>

                        <Col xs={24} sm={12} md={8} lg={6}>
                            {/* Date */}
                            <Form.Item
                                name="DATE"
                                label="Date"
                                rules={[{ required: true, message: 'Please select Date' }]}
                            >
                                <DatePicker style={inputStyle} />
                            </Form.Item>
                        </Col>



                        <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Gem Type */}
                        <Form.Item
                            name="POLICY"
                            label="Policy"
                        >
                            <Select placeholder="Select Policy" mode="multiple" allowClear showSearch>
                              <Option value="Given">Given</Option>
                              <Option value="Bought">Bought</Option>
                              <Option value="From Lot">From Lot</Option>
                              <Option value="Share">Share</Option>
                            </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        {/* File Upload */}
                        <Form.Item
                            name="PHOTO"
                            label="Upload Photo"
                        >
                          <Upload
                              customRequest={({ onSuccess, onError, file }) => {
                                onSuccess();
                              }}
                              fileList={fileList2}
                              onChange={(info) => this.handleFileChange(info, 2)}
                              {...fileLimit}
                              listType="picture-card"
                              showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                              maxCount={1} // Allow only one file
                              onPreview={() => this.setState({ previewVisible2: true })}
                          >
                            {fileList2.length >= 1 ? null : (
                                <div>
                                  <UploadOutlined  />
                                  <div className="ant-upload-text">Upload</div>
                                </div>
                            )}
                          </Upload>
                          {/* Display uploaded image */}
                              <div className="clearfix">
                                <Modal
                                    visible={this.state.previewVisible2}
                                    footer={null}
                                    onCancel={() => this.setState({ previewVisible2: false })}
                                >
                                  {this.state.imgBBLink2 === '' ? (
                                      <div className="loading-indicator">Uploading...</div>
                                  ) : (
                                      <img
                                          alt="Preview"
                                          style={{ width: '100%' }}
                                          src={this.state.imgBBLink2}
                                          onError={(e) => {
                                            console.error('Image loading error:', e);
                                          }}
                                      />
                                  )}
                                </Modal>
                              </div>
                        </Form.Item>
                      </Col>

                    </Row>
                    <Divider />


                    {gemType === 'Rough' && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={24} md={24} lg={24}>
                        {/* Gem Type */}
                        <Form.Item
                            name="ROUGH_TYPE"
                            label="Rough Gem Type"
                            rules={[{ required: true, message: 'Please select Rough Gem Type' }]}
                        >
                            <Select placeholder="Select Rough Gem Type" showSearch>
                              <Option value="Blue Sapphire Natural">Blue Sapphire - Natural</Option>
                              <Option value="Blue Sapphire Geuda">Blue Sapphire - Geuda</Option>
                              <Option value="Yellow Sapphire">Yellow Sapphire</Option>
                              <Option value="Pink Sapphire Natural">Pink Sapphire - Natural</Option>
                              <Option value="Purple Sapphire Natural">Purple Sapphire - Natural</Option>
                              <Option value="Violet Sapphire">Violet Sapphire</Option>
                              <Option value="Padparadscha Sapphire">Padparadscha Sapphire</Option>
                              <Option value="Mix">Mix</Option>
                              <Option value="Fancy">Fancy</Option>
                            </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    )}


                    {gemType === 'Lots' && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs={24} sm={12} md={12} lg={12}>
                          {/* Gem Type */}
                          <Form.Item
                              name="LOT_TYPE"
                              label="Lot Type"
                              rules={[{ required: true, message: 'Please select Lot Type' }]}
                          >
                            <Select placeholder="Select Lot Type" showSearch>
                              <Option value="Lots Buying">Lots - Buying</Option>
                              <Option value="Lots Mines">Lots - Mines</Option>
                              <Option value="Lots Selling">Lots - Selling</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                            name="REFERENCE_ID_LOTS"
                            label="Reference"
                        >
                            <Select placeholder="Select Reference"
                                    mode="multiple" allowClear showSearch
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
                    </Row>
                    )}
                    {gemType === 'Sorted Lots' && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={24} md={24} lg={24}>
                        {/* Gem Type */}
                        <Form.Item
                            name="SORTED_LOT_TYPE"
                            label="Sorted Lot Type"
                            rules={[{ required: true, message: 'Please select Sorted Lot Type' }]}
                        >
                          <Select placeholder="Select Sorted Lot Type" showSearch>
                            <Option value="Lots Blue">Lots - Blue</Option>
                            <Option value="Lots Geuda">Lots - Geuda</Option>
                            <Option value="Lots Yellow">Lots - Yellow</Option>
                            <Option value="Lots Mix">Lots - Mix</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="REFERENCE_ID_LOTS"
                            label="Reference"
                        >
                            <Select placeholder="Select Reference" mode="multiple" allowClear showSearch
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
                            name="FULL_LOT_COST"
                            label="Full Lot Cost (RS)"
                            type="number"
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Lot Cost" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                            name="PERFORMER"
                            label="Preformer"
                        >
                            <Select placeholder="Select Preformer" allowClear showSearch
                                    filterOption={(input, option) =>
                                        (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                        (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                    }>
                              {this.state.preformerOptions.map((option) => (
                                  <Option key={option.value} value={option.value} title={option.label}>
                                    {option.label}
                                  </Option>
                              ))}
                            </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    )}
                    {gemType === 'Cut and Polished' && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={24} md={24} lg={24}>
                        {/* Gem Type */}
                        <Form.Item
                            name="CP_TYPE"
                            label="Cut and Polished Type"
                            rules={[{ required: true, message: 'Please select Cut and Polished Type' }]}
                        >
                          <Select placeholder="Select Cut and Polished Type" showSearch>
                            <Option value="Blue Sapphire Natural">Blue Sapphire - Natural</Option>
                            <Option value="Blue Sapphire Heated">Blue Sapphire - Heated</Option>
                            <Option value="Yellow Sapphire">Yellow Sapphire</Option>
                            <Option value="Pink Sapphire Natural">Pink Sapphire - Natural</Option>
                            <Option value="Pink Sapphire Treated">Pink Sapphire - Treated</Option>
                            <Option value="Purple Sapphire Natural">Purple Sapphire - Natural</Option>
                            <Option value="Violet Sapphire Natural">Violet Sapphire - Natural</Option>
                            <Option value="Blue Sapphire Treated Lots">Blue Sapphire - Treated Lots</Option>
                            <Option value="Padparadscha Sapphire Natural">Padparadscha Sapphire - Natural</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={3}>
                        <Form.Item
                            name="REFERENCE_ID_CP"
                            label="Reference"
                        >
                            <Select placeholder="Select Item" allowClear showSearch
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
                      <Col xs={24} sm={24} md={24} lg={3}>
                        <Form.Item
                            name="TOTAL_COST"
                            label="Total Cost (RS)"
                            type="number"
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Total Cost" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="CP_BY"
                            label="Cutting & Polished By"
                        >
                            <Select placeholder="Select Customer" allowClear showSearch
                                    filterOption={(input, option) =>
                                        (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                        (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                    }>
                              {this.state.cpByOptions.map((option) => (
                                  <Option key={option.value} value={option.value} title={option.label}>
                                    {option.label}
                                  </Option>
                              ))}
                            </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="CP_COLOR"
                            label="Color"
                        >
                          <Input style={inputStyle} placeholder="Enter Color" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="SHAPE"
                            label="Shape"
                        >
                            <Select placeholder="Select Shape" allowClear showSearch>
                              <Option value="Oval">Oval</Option>
                              <Option value="Cabochon Oval">Cabochon Oval</Option>
                              <Option value="Cushion">Cushion</Option>
                              <Option value="Heart">Heart</Option>
                              <Option value="Pear">Pear</Option>
                              <Option value="Radiant">Radiant</Option>
                              <Option value="Rectangle">Rectangle</Option>
                              <Option value="Round">Round</Option>
                              <Option value="Square">Square</Option>
                              <Option value="Sugarloaf">Sugarloaf</Option>
                            </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    )}
                    <Divider />

                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={24} md={24} lg={3}>
                        <Form.Item
                            name="IS_HEAT_TREATED"
                            label="Is Heat Treated"
                        >
                          <Switch
                              checkedChildren="Heat Treated"
                              unCheckedChildren="Not Heat Treated"
                              onChange={this.handleSwitchChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="HT_ID"
                            label="Treatment Group"
                        >
                          <Select placeholder="Select Treatment Group" disabled={!this.state.isHeatTreated} allowClear showSearch
                                  filterOption={(input, option) =>
                                      (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                      (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                  }>
                            {heatTreatmentGroupOptions.filter((option) => option.type === 'Heat Treatment').map((option) => (
                                <Option key={option.value} value={option.value} title={option.label}>
                                  {option.code}
                                </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={3}>
                        {/* Weight (ct) */}
                        <Form.Item
                            name="WEIGHT_AFTER_HT"
                            label="Weight (ct) After HT"
                            rules={[
                              { type: 'number', message: 'Please enter a valid number' },
                            ]}
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Weight" disabled={!this.state.isHeatTreated} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="HT_BY"
                            label="Heat Treated By"
                        >
                          <Select placeholder="Select Customer" disabled={!this.state.isHeatTreated} allowClear showSearch
                                  filterOption={(input, option) =>
                                      (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                      (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                  }>
                            {this.state.htByOptions.map((option) => (
                                <Option key={option.value} value={option.value} title={option.label}>
                                  {option.label}
                                </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        {/* File Upload */}
                        <Form.Item
                            name="PHOTOS_AFTER_HT"
                            label="Upload Photos After HT"
                        >
                          <Upload disabled={!this.state.isHeatTreated}
                                  customRequest={({ onSuccess, onError, file }) => {
                                    onSuccess();
                                  }}
                                  fileList={fileList1}
                                  onChange={(info) => this.handleFileChange(info, 1)}
                                  {...fileLimit}
                                  listType="picture-card"
                                  showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                                  maxCount={1} // Allow only one file
                                  onPreview={() => this.setState({ previewVisible1: true })}
                          >
                            {fileList1.length >= 1 ? null : (
                                <div>
                                  <UploadOutlined  />
                                  <div className="ant-upload-text">Upload</div>
                                </div>
                            )}
                          </Upload>
                          {/* Display uploaded image */}
                          <div className="clearfix">
                            <Modal
                                visible={this.state.previewVisible1}
                                footer={null}
                                onCancel={() => this.setState({ previewVisible1: false })}
                            >
                              {this.state.imgBBLink1 === '' ? (
                                  <div className="loading-indicator">Uploading...</div>
                              ) : (
                                  <img
                                      alt="Preview"
                                      style={{ width: '100%' }}
                                      src={this.state.imgBBLink1}
                                      onError={(e) => {
                                        console.error('Image loading error:', e);
                                      }}
                                  />
                              )}
                            </Modal>
                          </div>
                        </Form.Item>


                      </Col>
                    </Row>
                      <Divider />

                      <Row gutter={[16, 16]} justify="left" align="top">
                          <Col xs={24} sm={24} md={24} lg={3}>
                              <Form.Item
                                  name="IS_ELEC_TREATED"
                                  label="Is Electric Treated"
                              >
                                  <Switch
                                      checkedChildren="Electric Treated"
                                      unCheckedChildren="Not Electric Treated"
                                      onChange={this.handleSwitchChangeET}
                                  />
                              </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6}>
                              <Form.Item
                                  name="ET_ID"
                                  label="Treatment Group"
                              >
                                  <Select placeholder="Select Treatment Group" disabled={!this.state.isElectricTreated} allowClear showSearch
                                          filterOption={(input, option) =>
                                              (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                              (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                          }>
                                      {heatTreatmentGroupOptions.filter((option) => option.type === 'Electric Treatment').map((option) => (
                                          <Option key={option.value} value={option.value} title={option.label}>
                                              {option.code}
                                          </Option>
                                      ))}
                                  </Select>
                              </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={3}>
                              {/* Weight (ct) */}
                              <Form.Item
                                  name="WEIGHT_AFTER_ET"
                                  label="Weight (ct) After ET"
                                  rules={[
                                      { type: 'number', message: 'Please enter a valid number' },
                                  ]}
                              >
                                  <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Weight" disabled={!this.state.isElectricTreated} />
                              </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6}>
                              <Form.Item
                                  name="ET_BY"
                                  label="Electric Treated By"
                              >
                                  <Select placeholder="Select Customer" disabled={!this.state.isElectricTreated} allowClear showSearch
                                          filterOption={(input, option) =>
                                              (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                              (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                          }>
                                      {this.state.etByOptions.map((option) => (
                                          <Option key={option.value} value={option.value} title={option.label}>
                                              {option.label}
                                          </Option>
                                      ))}
                                  </Select>
                              </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6}>
                              {/* File Upload */}
                              <Form.Item
                                  name="PHOTOS_AFTER_ET"
                                  label="Upload Photos After ET"
                              >
                                  <Upload disabled={!this.state.isElectricTreated}
                                          customRequest={({ onSuccess, onError, file }) => {
                                              onSuccess();
                                          }}
                                          fileList={fileList3}
                                          onChange={(info) => this.handleFileChange(info, 3)}
                                          {...fileLimit}
                                          listType="picture-card"
                                          showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                                          maxCount={1} // Allow only one file
                                          onPreview={() => this.setState({ previewVisible3: true })}
                                  >
                                      {fileList3.length >= 1 ? null : (
                                          <div>
                                              <UploadOutlined  />
                                              <div className="ant-upload-text">Upload</div>
                                          </div>
                                      )}
                                  </Upload>
                                  {/* Display uploaded image */}
                                  <div className="clearfix">
                                      <Modal
                                          visible={this.state.previewVisible3}
                                          footer={null}
                                          onCancel={() => this.setState({ previewVisible3: false })}
                                      >
                                          {this.state.imgBBLink3 === '' ? (
                                              <div className="loading-indicator">Uploading...</div>
                                          ) : (
                                              <img
                                                  alt="Preview"
                                                  style={{ width: '100%' }}
                                                  src={this.state.imgBBLink3}
                                                  onError={(e) => {
                                                      console.error('Image loading error:', e);
                                                  }}
                                              />
                                          )}
                                      </Modal>
                                  </div>
                              </Form.Item>


                          </Col>
                      </Row>
                    <Divider />

                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item>
                        <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Buying Details</span>
                        </Form.Item>
                        </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="SELLER"
                            label="Seller"
                            rules={[
                              {
                                required: this.state.isTransaction,
                                message: 'Please enter Seller',
                              },
                            ]}
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

                      <Col xs={24} sm={24} md={24} lg={3}>
                        <Form.Item
                            name="COST"
                            label="Cost (RS)"
                            type="number"
                            rules={[
                              {
                                required: this.state.isTransaction,
                                message: 'Please enter Cost',
                              },
                            ]}
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Cost" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={3}>
                        <Form.Item
                            name="GIVEN_AMOUNT"
                            label="Amount Given"
                            type="number"
                            rules={[
                              {
                                required: this.state.isTransaction,
                                message: 'Please enter Given Amount',
                              },
                            ]}
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Amount" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Gem Type */}
                        <Form.Item
                            name="PAYMENT_METHOD"
                            label="Transaction Method"
                            initialValue="Cash"
                            rules={[{ required: this.state.isTransaction, message: 'Please select Transaction Method' }]}
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
                        <Form.Item
                            name="IS_TRANSACTION"
                            label="Add Buying Datails as a Transaction"
                        >
                          <Switch
                              checkedChildren="Add Transaction"
                              unCheckedChildren="Don't Add Transaction"
                              onChange={this.handleSwitchChangeTR}
                              checked={this.state.isTransaction}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]} justify="left" align="top">
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
                      <Col xs={24} sm={12} md={12} lg={12}>
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
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                            name="EXPENSE_AMOUNT"
                            label="Total Expense Amount"
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Expense Amount" />
                        </Form.Item>
                      </Col>
                    </Row>


                    <Divider/>

                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item>
                          <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Selling Details</span>
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item name="BUYER" label="Buyer">
                          <Select style={inputStyle} placeholder="Select Buyer" allowClear showSearch
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

                      <Col xs={24} sm={12} md={12} lg={12}>
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


                      {/* Date Sold, Sold Amount, Amount Received, Due Amount */}
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="DATE_SOLD"
                            label="Date Sold"
                        >
                          <DatePicker style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="SOLD_AMOUNT"
                            label="Sold Amount"
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Sold Amount" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="AMOUNT_RECEIVED"
                            label="Amount Received"
                        >
                          <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Amount Received" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={1}>
                        <Form.Item
                            label=" "
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
                        >
                          <InputNumber style={inputStyle} step={0.01} placeholder="Enter Due Amount" />
                        </Form.Item>
                      </Col>

                      {/* Payment ETA - Start, Payment ETA - End, Date Finished */}
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

                    </Row>

                    <Row gutter={[16, 16]} justify="left" align="top">
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Add Item
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
