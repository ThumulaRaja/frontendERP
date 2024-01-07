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
    Upload,
    Button,
    message,
    DatePicker,
    Input, Divider, Modal
} from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import moment from 'moment';
import {RightOutlined, UploadOutlined} from "@ant-design/icons";

const { Option } = Select;

class UpdateItemsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHeatTreated: this.props.initialValues.IS_HEAT_TREATED ? this.props.initialValues.IS_HEAT_TREATED : false,
            isTransaction: this.props.initialValues.IS_TRANSACTION ? this.props.initialValues.IS_TRANSACTION : false,
            fileList: [],
            gemType: this.props.initialValues.TYPE,
            customerOptions: [],
            heatTreatmentGroupOptions: [],
            ReferenceOptions: [],

            enlargedImageVisible: false,
            enlargedImageVisibleHT: false,


            fileList1: [],  // For the first photo uploader
            previewVisible1: false,
            previewImage1: '',
            imgBBLink1: this.props.initialValues.PHOTOS_AFTER_HT_LINK ? this.props.initialValues.PHOTOS_AFTER_HT_LINK : '',

            fileList2: [],  // For the second photo uploader
            previewVisible2: false,
            previewImage2: '',
            imgBBLink2: this.props.initialValues.PHOTO_LINK ? this.props.initialValues.PHOTO_LINK : '',
        };
        this.showProps();
        // this.handleSwitchChange(this.props.initialValues.IS_HEAT_TREATED);

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

    async componentDidMount() {
        // Fetch customer options when the component mounts
        const customerOptions = await this.fetchCustomerOptions();
        this.setState({ customerOptions });
        const heatTreatmentGroupOptions = await this.fetchHTGroupOptions();
        this.setState({ heatTreatmentGroupOptions });
        const ReferenceOptions = await this.fetchReferenceOptions();
        this.setState({ ReferenceOptions });

    }

    showProps = () => {
        console.log("this.props",this.props);
    }

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
                    console.log('Image uploaded to ImgBB:', response.data.data.url);
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

    handleSwitchChangeTR = (checked) => {
        this.setState({ isTransaction: checked });
    }



    async fetchCustomerOptions() {
        try {
            const response = await axios.post("http://localhost:3001/getAllCustomers");
            console.log("response", response);
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
            console.log("response", response);
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
            const response = await axios.post("http://localhost:3001/getAllHT");
            console.log("response", response);
            return response.data.result.map((ht) => ({
                value: ht.HT_ID,
                label: ht.NAME,
                code: ht.CODE,
            }));
        } catch (error) {
            console.error("Error fetching heat Treatment Group Options:", error);
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
                ITEM_ID_AI: this.props.initialValues.ITEM_ID_AI,
                IS_ACTIVE: 1,
                CREATED_BY: USER_ID,
                PHOTO_LINK: this.state.imgBBLink2,
                PHOTOS_AFTER_HT_LINK: this.state.imgBBLink1,
                SHARE_HOLDERS: shareHoldersString,
                REFERENCE_ID_LOTS: referenceString,
                IS_TRANSACTION: this.state.isTransaction,
                IS_HEAT_TREATED: this.state.isHeatTreated,
                POLICY: policyString,
            };

            console.log("updatedValues", updatedValues);

            const response = await axios.post('http://localhost:3001/updateItem', updatedValues);

            if (response.data.success) {
                message.success('Item updated successfully');

                // Close the modal
                this.props.onCancel();

                this.props.onUpdate();

                // You can reset the form if needed
                this.formRef.current.resetFields();

            } else {
                message.error('Failed to update Item');
            }
        } catch (error) {
            console.error('Error updating Item:', error);
            message.error('Internal server error');
        }
    };

    render() {

        const inputStyle = {
            width: '100%',
            height: '30px',
        };

        const {  gemType, customerOptions,heatTreatmentGroupOptions,fileList1,fileList2,ReferenceOptions } = this.state;

        const fileLimit = {
            accept: 'image/*', // Accept only image files
        };

        return (
            <>
                <div className="tabled">
                    <Row gutter={[24, 0]}>
                        <Col xs="24" xl={24}>
                            <Card
                                className="criclebox tablespace mb-24"
                                title={this.props.initialValues.CODE}
                            >
                                <Form
                                    layout="vertical"
                                    onFinish={this.handleSubmit}
                                    style={{ margin: '20px' }}
                                    ref={this.formRef}
                                >
                                    <Row gutter={16}>
                                        <Col span={6}>
                                            {/* No of Pieces */}
                                            <Form.Item
                                                name="CODE"
                                                label="Item Code"
                                                initialValue={this.props.initialValues.CODE}
                                                rules={[{ required: true, message: 'Please item Code Type' }]}
                                            >
                                                <Input style={inputStyle}  placeholder="Enter ID"/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            {/* Gem Type */}
                                            <Form.Item
                                                name="TYPE"
                                                label="Gem Type"
                                                initialValue={gemType}
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

                                        <Col span={6}>
                                            {/* Status */}
                                            <Form.Item
                                                name="STATUS"
                                                label="Status"
                                                initialValue={this.props.initialValues.STATUS}
                                                rules={[{ required: true, message: 'Please select Status' }]}
                                            >
                                                <Select style={inputStyle} placeholder="Select Status" showSearch>
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
                                        <Col span={3}>
                                            {/* No of Pieces */}
                                            <Form.Item
                                                name="ITEM_ID"
                                                label="Item ID"
                                                type="number"
                                                initialValue={this.props.initialValues.ITEM_ID}
                                                rules={[
                                                    { required: true, message: 'Please enter Item ID' },
                                                ]}
                                            >
                                                <InputNumber style={inputStyle}  placeholder="Enter ID" />
                                            </Form.Item>
                                        </Col>

                                        <Col span={3}>
                                            {/* Weight (ct) */}
                                            <Form.Item
                                                name="WEIGHT"
                                                label="Weight (ct)"
                                                initialValue={this.props.initialValues.WEIGHT}
                                            >
                                                <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Weight" />
                                            </Form.Item>
                                        </Col>

                                        <Col span={6}>
                                            {/* No of Pieces */}
                                            <Form.Item
                                                name="PIECES"
                                                label="No of Pieces"
                                                type="number"
                                                initialValue={this.props.initialValues.PIECES}

                                            >
                                                <InputNumber style={inputStyle} min={0} placeholder="Enter Pieces" />
                                            </Form.Item>
                                        </Col>

                                        <Col span={6}>
                                            {/* Date */}
                                            <Form.Item
                                                name="DATE"
                                                label="Date"
                                                initialValue={this.props.initialValues.DATE ? moment(this.props.initialValues.DATE) : null}
                                            >
                                                <DatePicker style={inputStyle} />
                                            </Form.Item>
                                        </Col>

                                        <Col span={6}>
                                            {/* Gem Type */}
                                            <Form.Item
                                                name="POLICY"
                                                label="Policy"
                                                initialValue={this.props.initialValues.POLICY ? this.props.initialValues.POLICY.split(',') : undefined}
                                            >
                                                <Select placeholder="Select Policy" mode="multiple" allowClear showSearch>
                                                    <Option value="Given">Given</Option>
                                                    <Option value="Bought">Bought</Option>
                                                    <Option value="From Lot">From Lot</Option>
                                                    <Option value="Share">Share</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        {this.props.initialValues.PHOTO_LINK && (
                                        <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Form.Item
                                                label="Photo"
                                            >
                                            {/* Display initial photo */}
                                            {this.props.initialValues.PHOTO_LINK && (
                                                <img
                                                    alt="Initial Photo"
                                                    style={{ width: '100%', borderRadius: '5px', cursor: 'pointer' }}
                                                    src={this.props.initialValues.PHOTO_LINK}
                                                    onClick={() => this.setState({ enlargedImageVisible: true })}
                                                />
                                            )}

                                            {/* Enlarged view modal */}
                                            <Modal
                                                visible={this.state.enlargedImageVisible}
                                                footer={null}
                                                onCancel={() => this.setState({ enlargedImageVisible: false })}
                                            >
                                                {this.props.initialValues.PHOTO_LINK && (
                                                    <img
                                                        alt="Enlarged View"
                                                        style={{ width: '100%' }}
                                                        src={this.props.initialValues.PHOTO_LINK}
                                                        onError={(e) => {
                                                            console.error('Image loading error:', e);
                                                        }}
                                                    />
                                                )}
                                            </Modal>
                                            </Form.Item>
                                        </Col>
                                        )}
                                        <Col span={3}>
                                            {/* File Upload */}
                                            <Form.Item
                                                name="PHOTO"
                                                label="Change Photo"
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
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                {/* Gem Type */}
                                                <Form.Item
                                                    name="ROUGH_TYPE"
                                                    label="Rough Gem Type"
                                                    initialValue={this.props.initialValues.ROUGH_TYPE}
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
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                {/* Gem Type */}
                                                <Form.Item
                                                    name="LOT_TYPE"
                                                    label="Lot Type"
                                                    initialValue={this.props.initialValues.LOT_TYPE}
                                                    rules={[{ required: true, message: 'Please select Lot Type' }]}
                                                >
                                                    <Select placeholder="Select Lot Type" showSearch>
                                                        <Option value="Lots Buying">Lots - Buying</Option>
                                                        <Option value="Lots Mines">Lots - Mines</Option>
                                                        <Option value="Lots Selling">Lots - Selling</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="REFERENCE_ID_LOTS"
                                                    label="Reference"
                                                    initialValue={
                                                        this.props.initialValues.REFERENCE_ID_LOTS
                                                            ? this.props.initialValues.REFERENCE_ID_LOTS.split(',').map(Number)
                                                            : undefined
                                                    }                                                >
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
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                {/* Gem Type */}
                                                <Form.Item
                                                    name="SORTED_LOT_TYPE"
                                                    label="Sorted Lot Type"
                                                    initialValue={this.props.initialValues.SORTED_LOT_TYPE}
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
                                            <Col span={6}>
                                                <Form.Item
                                                    name="REFERENCE_ID_LOTS"
                                                    label="Reference"
                                                    initialValue={
                                                        this.props.initialValues.REFERENCE_ID_LOTS
                                                            ? this.props.initialValues.REFERENCE_ID_LOTS.split(',').map(Number)
                                                            : undefined
                                                    }                                                        >
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
                                            <Col span={6}>
                                                <Form.Item
                                                    name="FULL_LOT_COST"
                                                    label="Full Lot Cost (RS)"
                                                    type="number"
                                                >
                                                    <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Lot Cost" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="PERFORMER"
                                                    label="Performer"
                                                    initialValue={this.props.initialValues.PERFORMER}
                                                >
                                                    <Select placeholder="Select Performer" allowClear showSearch
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
                                        </Row>
                                    )}
                                    {gemType === 'Cut and Polished' && (
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                {/* Gem Type */}
                                                <Form.Item
                                                    name="CP_TYPE"
                                                    label="Cut and Polished Type"
                                                    initialValue={this.props.initialValues.CP_TYPE}
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
                                            <Col span={3}>
                                                <Form.Item
                                                    name="REFERENCE_ID_CP"
                                                    label="Reference"
                                                    initialValue={this.props.initialValues.REFERENCE_ID_CP}
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
                                            <Col span={3}>
                                                <Form.Item
                                                    name="TOTAL_COST"
                                                    label="Total Cost (RS)"
                                                    type="number"
                                                    initialValue={this.props.initialValues.TOTAL_COST}
                                                >
                                                    <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Total Cost" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="CP_BY"
                                                    label="Cutting & Polished By"
                                                    initialValue={this.props.initialValues.CP_BY}
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

                                            <Col span={6}>
                                                <Form.Item
                                                    name="CP_COLOR"
                                                    label="Color"
                                                    initialValue={this.props.initialValues.CP_COLOR}
                                                >
                                                    <Input style={inputStyle} placeholder="Enter Color" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="SHAPE"
                                                    label="Shape"
                                                    initialValue={this.props.initialValues.SHAPE}
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

                                    <Row gutter={16}>
                                        <Col span={3}>
                                            <Form.Item
                                                name="IS_HEAT_TREATED"
                                                label="Is Heat Treated"
                                                initialValue={this.props.initialValues.IS_HEAT_TREATED}
                                            >
                                                <Switch
                                                    checkedChildren="Heat Treated"
                                                    unCheckedChildren="Not Heat Treated"
                                                    onChange={this.handleSwitchChange}
                                                    disabled
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="HT_ID"
                                                label="Heat Treatment Group"
                                                initialValue={this.props.initialValues.HT_ID}
                                            >
                                                <Select placeholder="Select Heat Treatment Group" allowClear showSearch disabled
                                                        filterOption={(input, option) =>
                                                            (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                                            (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                                        }>
                                                    {heatTreatmentGroupOptions.map((option) => (
                                                        <Option key={option.value} value={option.value} title={option.label}>
                                                            {option.label} ({option.code})
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            {/* Weight (ct) */}
                                            <Form.Item
                                                name="WEIGHT_AFTER_HT"
                                                label="Weight (ct) After HT"
                                                initialValue={this.props.initialValues.WEIGHT_AFTER_HT}
                                            >
                                                <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Weight" disabled={!this.state.isHeatTreated} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="HT_BY"
                                                label="Heat Treated By"
                                                initialValue={this.props.initialValues.HT_BY}
                                            >
                                                <Select placeholder="Select Customer" disabled={!this.state.isHeatTreated} allowClear showSearch
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
                                        {this.props.initialValues.PHOTOS_AFTER_HT_LINK && this.state.isHeatTreated && (
                                            <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Form.Item
                                                    label="Photo After HT"
                                                >
                                                    {/* Display initial photo */}
                                                    {this.props.initialValues.PHOTOS_AFTER_HT_LINK && (
                                                        <img
                                                            alt="Initial Photo"
                                                            style={{ width: '100%', borderRadius: '5px', cursor: 'pointer' }}
                                                            src={this.props.initialValues.PHOTOS_AFTER_HT_LINK}
                                                            onClick={() => this.setState({ enlargedImageVisibleHT: true })}
                                                        />
                                                    )}

                                                    {/* Enlarged view modal */}
                                                    <Modal
                                                        visible={this.state.enlargedImageVisibleHT}
                                                        footer={null}
                                                        onCancel={() => this.setState({ enlargedImageVisibleHT: false })}
                                                    >
                                                        {this.props.initialValues.PHOTOS_AFTER_HT_LINK && (
                                                            <img
                                                                alt="Enlarged View"
                                                                style={{ width: '100%' }}
                                                                src={this.props.initialValues.PHOTOS_AFTER_HT_LINK}
                                                                onError={(e) => {
                                                                    console.error('Image loading error:', e);
                                                                }}
                                                            />
                                                        )}
                                                    </Modal>
                                                </Form.Item>
                                            </Col>
                                        )}
                                        <Col span={3}>
                                            {/* File Upload */}
                                            <Form.Item
                                                name="PHOTOS_AFTER_HT"
                                                label="Change Photos After HT"
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

                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item>
                                                <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Buying Details</span>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="BUYER"
                                                label="Buyer"
                                                initialValue={this.props.initialValues.BUYER}
                                                rules={[
                                                    {
                                                        required: this.state.isTransaction,
                                                        message: 'Please enter Buyer',
                                                    },
                                                ]}
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

                                        <Col span={3}>
                                            <Form.Item
                                                name="COST"
                                                label="Cost (RS)"
                                                type="number"
                                                initialValue={this.props.initialValues.COST}
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
                                        <Col span={3}>
                                            <Form.Item
                                                name="GIVEN_AMOUNT"
                                                label="Amount Given"
                                                type="number"
                                                initialValue={this.props.initialValues.GIVEN_AMOUNT}
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
                                        <Col span={6}>
                                            {/* Gem Type */}
                                            <Form.Item
                                                name="PAYMENT_METHOD"
                                                label="Transaction Method"
                                                initialValue={this.props.initialValues.PAYMENT_METHOD}
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
                                        <Col span={6}>
                                            <Form.Item
                                                name="IS_TRANSACTION"
                                                label="Add Buying Details as a Transaction"
                                                initialValue={this.props.initialValues.IS_TRANSACTION}
                                            >
                                                <Switch
                                                    checkedChildren="Add Transaction"
                                                    unCheckedChildren="Don't Add Transaction"
                                                    onChange={this.handleSwitchChangeTR}
                                                    disabled
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={9}>
                                            <Form.Item name="SHARE_HOLDERS" label="Share Holders"
                                                       initialValue={
                                                           this.props.initialValues.SHARE_HOLDERS
                                                               ? this.props.initialValues.SHARE_HOLDERS.split(',').map(Number)
                                                               : undefined
                                                       }>
                                                <Select style={inputStyle} placeholder="Select Share Holders" mode="multiple" allowClear showSearch
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
                                        <Col span={3}>
                                            <Form.Item
                                                name="SHARE_PERCENTAGE"
                                                label="Share Percentage %"
                                                initialValue={this.props.initialValues.SHARE_PERCENTAGE}
                                            >
                                                <InputNumber style={inputStyle} min={0} max={100} placeholder="Enter Share" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="OTHER_SHARES"
                                                label="Other Shares"
                                                initialValue={this.props.initialValues.OTHER_SHARES}
                                            >
                                                <Input style={inputStyle}  placeholder="Enter Other Shares" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="COMMENTS"
                                                label="Comments"
                                                initialValue={this.props.initialValues.COMMENTS}
                                            >
                                                <Input.TextArea rows={2} placeholder="Enter comments" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item
                                                name="EXPENSE_AMOUNT"
                                                label="Total Expense Amount"
                                                initialValue={this.props.initialValues.EXPENSE_AMOUNT}
                                            >
                                                <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Expense Amount" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Divider/>

                                    <Row gutter={16}>


                                        {/* Seller, Bearer */}
                                        <Col span={12}>
                                            <Col span={24}>
                                                <Form.Item>
                                                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Selling Details</span>
                                                </Form.Item>
                                            </Col>
                                            <Form.Item name="SELLER" label="Seller" initialValue={this.props.initialValues.SELLER}>
                                                <Select style={inputStyle} placeholder="Select Seller" allowClear showSearch
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

                                        <Col span={12}>
                                            <Form.Item name="BEARER" label="Bearer" initialValue={this.props.initialValues.BEARER}>
                                                <Select style={inputStyle} placeholder="Select Bearer" allowClear showSearch
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

                                        {/* Expenses, Exp. Amount */}
                                        {/*<Col span={12}>*/}
                                        {/*    <Form.Item*/}
                                        {/*        name="EXPENSES"*/}
                                        {/*        label="Expenses"*/}
                                        {/*        initialValue={this.props.initialValues.EXPENSES}*/}
                                        {/*    >*/}
                                        {/*        <Input style={inputStyle} placeholder="Enter Expenses" />*/}
                                        {/*    </Form.Item>*/}
                                        {/*</Col>*/}


                                        {/* Date Sold, Sold Amount, Amount Received, Due Amount */}
                                        <Col span={6}>
                                            <Form.Item
                                                name="DATE_SOLD"
                                                label="Date Sold"
                                                initialValue={this.props.initialValues.DATE_SOLD? moment(this.props.initialValues.DATE_SOLD):null}
                                            >
                                                <DatePicker style={inputStyle} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="SOLD_AMOUNT"
                                                label="Sold Amount"
                                                initialValue={this.props.initialValues.SOLD_AMOUNT}
                                            >
                                                <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Sold Amount" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="AMOUNT_RECEIVED"
                                                label="Amount Received"
                                                initialValue={this.props.initialValues.AMOUNT_RECEIVED}
                                            >
                                                <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Amount Received" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={1}>
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
                                        <Col span={5}>
                                            <Form.Item
                                                name="DUE_AMOUNT"
                                                label="Due Amount"
                                                initialValue={this.props.initialValues.DUE_AMOUNT}
                                            >
                                                <InputNumber style={inputStyle} step={0.01} placeholder="Enter Due Amount" />
                                            </Form.Item>
                                        </Col>

                                        {/* Payment ETA - Start, Payment ETA - End, Date Finished */}
                                        <Col span={6}>
                                            <Form.Item
                                                name="PAYMENT_ETA_START"
                                                label="Payment ETA - Start"
                                                initialValue={this.props.initialValues.PAYMENT_ETA_START? moment(this.props.initialValues.PAYMENT_ETA_START):null}
                                            >
                                                <DatePicker style={inputStyle} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="PAYMENT_ETA_END"
                                                label="Payment ETA - End"
                                                initialValue={this.props.initialValues.PAYMENT_ETA_END? moment(this.props.initialValues.PAYMENT_ETA_END):null}
                                            >
                                                <DatePicker style={inputStyle} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="DATE_FINISHED"
                                                label="Date Finished"
                                                initialValue={this.props.initialValues.DATE_FINISHED? moment(this.props.initialValues.DATE_FINISHED):null}
                                            >
                                                <DatePicker style={inputStyle} />
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Update Item
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

export default UpdateItemsForm;
