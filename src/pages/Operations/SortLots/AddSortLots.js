// /* eslint-disable */
import React from 'react';
import {
    Form,
    Input,
    Button,
    Col,
    Row,
    message,
    Select,
    Divider,
    InputNumber,
    Modal,
    Switch,
    Upload,
    DatePicker
} from 'antd';
import axios from "axios";
import Cookies from 'js-cookie';
import {RightOutlined, UploadOutlined} from "@ant-design/icons";
import moment from "moment/moment";
const { Option } = Select;


class AddSortLots extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            referenceOptions: [],
            customerOptions: [],
            buyerOptions: [],
            sellerOptions: [],
            salesPersonOptions: [],
            partnerOptions: [],
            htByOptions: [],
            cpByOptions: [],
            preformerOptions: [],
        etByOptions: [],

            fileList2: [],  // For the second photo uploader
            previewVisible2: false,
            previewImage2: '',
            imgBBLink2: '',

            resultArray: [],
            photo: null,
            currentCode: this.props.currentCode,
            oldDeactivate: true,

        };

        this.formRef = React.createRef();
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
        try {
            const referenceOptions = await this.fetchReferenceOptions();
            this.setState({ referenceOptions });
            const customerOptions = await this.fetchCustomerOptions();
            this.setState({ customerOptions });
        } catch (error) {
            console.error('Error fetching reference options:', error);
        }
    }

    async fetchReferenceOptions() {
        try {
            const response = await axios.post('http://35.154.1.99:3001/getItemsForReference');
            //console.log('response', response);
            return response.data.result.map((ref) => ({
                value: ref.ITEM_ID_AI,
                label: ref.CODE,
            }));
        } catch (error) {
            console.error('Error fetching reference options:', error);
            return [];
        }
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
                    //console.log('Image uploaded to ImgBB:', response.data.data.url);
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


    handleSubmit = async (values) => {
        try {
            // Retrieve USER_ID from rememberedUser
            let rememberedUser = Cookies.get('rememberedUser');
            let USER_ID = null;

            if (rememberedUser) {
                rememberedUser = JSON.parse(rememberedUser);
                USER_ID = rememberedUser.USER_ID;
            }

            const referenceString = Array.isArray(values.REFERENCE_ID_LOTS)
                ? values.REFERENCE_ID_LOTS.join(',')
                : values.REFERENCE_ID_LOTS ? values.REFERENCE_ID_LOTS.toString() : '';

            // Main data for the request
            const resultArrayData = {
                ...values,
                PHOTO: this.state.imgBBLink2,
                OLD_REFERENCE: referenceString,
                CREATED_BY: USER_ID,
            };


            //console.log('resultArrayData', resultArrayData);

            // Send the request
            const response = await axios.post('http://35.154.1.99:3001/addSortLot', resultArrayData);

            if (response.data.success) {
                message.success('Sort Lot added successfully');
                // Close the modal
                this.props.onClose();
                // Refresh the table
                if(this.props.refe){
                    this.formRef.current.resetFields();
                }
                else{
                    this.props.refreshTable();
                    // You can reset the form if needed
                    this.formRef.current.resetFields();
                }
            } else {
                message.error('Failed to add Sort Lot');
            }
        } catch (error) {
            console.error('Error adding Sort Lot:', error);
            message.error('Internal server error');
        }
    };


    render() {
        const { referenceOptions,customerOptions,fileList2 } = this.state;

        const inputStyle = {
            // pointerEvents: "none", // Disable pointer events to prevent interaction
            // background: "#f5f5f5", // Set a background color to indicate it's disabled
            width: "100%"
        }

        const fileLimit = {
            accept: 'image/*', // Accept only image files
        };

        return (
            <Form ref={this.formRef} layout="vertical" onFinish={this.handleSubmit}>
                <Row gutter={[16, 16]} justify="left" align="top">

                    <Col xs={24} sm={12} md={8} lg={12}>
                        <Form.Item
                            name="REFERENCE_ID_LOTS"
                            label="References"
                        >
                            <Select placeholder="Select Reference" mode="multiple" allowClear showSearch
                                    filterOption={(input, option) =>
                                        (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                        (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                    }>
                                {referenceOptions.map((option) => (
                                    <Option key={option.value} value={option.value} title={option.label}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                        <Col xs={24} sm={24} md={24} lg={6}>
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
                        {/* Status */}
                        <Form.Item
                            name="STATUS"
                            label="Status"
                            initialValue="Preformed"
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
                                <Option value="">With Preformer</Option>
                            </Select>
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

                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item
                                name="FULL_LOT_COST"
                                label="Full Lot Cost (RS)"
                                type="number"
                            >
                                <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Lot Cost" />
                            </Form.Item>
                        </Col>

                    <Col xs={24} sm={24} md={24} lg={6}>
                        {/* Weight (ct) */}
                        <Form.Item
                            name="WEIGHT"
                            label="Weight After Sorting (ct)"
                        >
                            <InputNumber min={0} step={0.01} placeholder="Enter Weight" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={3}>
                        {/* File Upload */}
                        <Form.Item
                            name="PHOTO"
                            label="Sorted Lot Photo"
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

                    <Col xs={24} sm={24} md={24} lg={15}>
                        <Form.Item
                            name="REMARK"
                            label="Remarks"
                        >
                            <Input.TextArea rows={4} placeholder="Enter remarks" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="IS_REFERENCE_DEACTIVATED"
                            label="Is Want to Remove From Inventory"
                            initialValue={this.state.oldDeactivate}
                        >
                            <Switch
                                checkedChildren="Remove Reference"
                                unCheckedChildren="Keep Reference"
                                onChange={(checked) => {
                                    this.setState({ oldDeactivate: checked });
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add Sorted Lot
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default AddSortLots;
