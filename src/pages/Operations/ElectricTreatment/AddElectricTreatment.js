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
import {UploadOutlined} from "@ant-design/icons";
import moment from "moment/moment";
const { Option } = Select;


class AddElectricTreatment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            referenceOptions: [],
            heatTreatmentGroupOptions: [],
            enlargedImageVisible: false,
            enlargedImageVisibleET: false,
            customerOptions: [],
            buyerOptions: [],
            sellerOptions: [],
            salesPersonOptions: [],
            partnerOptions: [],
            htByOptions: [],
            cpByOptions: [],
            preformerOptions: [],
        etByOptions: [],

            fileList: {}, // Change fileList1 to fileList
            previewVisible: {}, // Change previewVisible1 to previewVisible
            imgBBLink: {}, // Change imgBBLink1 to imgBBLink

            resultArray: [],

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
            const heatTreatmentGroupOptions = await this.fetchHTGroupOptions();
            this.setState({ heatTreatmentGroupOptions });
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

    handleCustomerChange = async (value) => {
        const form = this.formRef.current;
        try {
            for(let i=0;i<this.state.resultArray.length;i++){
                form.setFieldsValue({
                    [`ET_BY_${i+1}`]: value,
                });
            }
        } catch (error) {
            console.error("Error fetching reference options:", error);
            return [];
        }
    }

    async fetchHTGroupOptions() {
        try {
            const response = await axios.post("http://35.154.1.99:3001/getAllHT");
            //console.log("response", response);

            return response.data.result.filter((ht) => ht.TYPE === 'Electric Treatment').map((ht) => ({
                value: ht.HT_ID,
                code: ht.CODE,
            }));
        } catch (error) {
            console.error("Error fetching Elec Treatment Options:", error);
            return [];
        }
    }

    loadReferenceFromETGroup = async (value) => {
        const form = this.formRef.current;
        try {
            this.setState({ resultArray: [] });
            const response = await axios.post('http://35.154.1.99:3001/getReferenceFromETGroup', {
                HT_ID: value,
            });
            if (response.data.success) {
                //console.log("response1", response);

                // Store the result array in the component state
                this.setState({ resultArray: response.data.result });

            } else {
                message.error('Failed to fetch Item Details');
            }
        } catch (error) {
            console.error("Error fetching reference options:", error);
            return [];
        }
    };

    handleFileChange = async ({ fileList }, { index }) => {
        try {
            this.setState({
                fileList: {
                    ...this.state.fileList,
                    [index]: fileList,
                },
                previewVisible: {
                    ...this.state.previewVisible,
                    [index]: false, // Close preview when a new file is selected
                },
                imgBBLink: {
                    ...this.state.imgBBLink,
                    [index]: '', // Reset imgBBLink when a new file is selected
                },
            });

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

                    const imgBBLinkKey = `imgBBLink${index}`;
                    this.setState({
                        [imgBBLinkKey]: response.data.data.url,
                    });
                    //show success message if response is success
                    if (response.data.success) {
                        message.success('Image uploaded successfully');
                    }
                    //show not success message if response is not success
                    else {
                        message.error('Failed to upload Image');
                    }
                    //console.log('this.state', this.state);
                    //console.log('Image uploaded to ImgBB:', response.data.data.url);
                }
            }
        } catch (error) {
            // Log and handle errors as needed
            console.error('Error in handleFileChange:', error);

            if (error.response) {
                console.error('ImgBB API Error:', error.response.data);
            } else if (error.request) {
                console.error('No response received from ImgBB API');
            } else {
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

            // Main data for the request
            const mainData = {
                ...values,
                CREATED_BY: USER_ID,
            };

            // Organize sub-data into an array
            const subDataArray = this.state.resultArray.map((referenceData, index) => ({
                REFERENCE: values[`REFERENCE_${index + 1}`],
                AFTER_STATUS: values[`AFTER_STATUS_${index + 1}`],
                WEIGHT_AFTER_ET: values[`WEIGHT_AFTER_ET_${index + 1}`],
                ET_BY: values[`ET_BY_${index + 1}`],
                PHOTOS_AFTER_ET_LINK: this.state[`imgBBLink${index}`] === undefined ? referenceData.PHOTOS_AFTER_ET_LINK : this.state[`imgBBLink${index}`],
            }));

            // Combine main data with sub-data array
            const resultArrayData = {
                mainData,
                subDataArray,
            };
            //console.log('resultArrayData', resultArrayData);

            // Send the request
            const response = await axios.post('http://35.154.1.99:3001/addElecT', resultArrayData);

            if (response.data.success) {
                message.success('Elec Treatment added successfully');
                // Close the modal
                this.props.onClose();
                // Refresh the table
                this.props.refreshTable();
                // You can reset the form if needed
                this.formRef.current.resetFields();
            } else {
                message.error('Failed to add Elec Treatment');
            }
        } catch (error) {
            console.error('Error adding Elec Treatment:', error);
            message.error('Internal server error');
        }
    };



    renderFormFields = () => {
        const { resultArray, referenceOptions, customerOptions, fileList1 } = this.state;

        const disableStyle = {
            pointerEvents: "none", // Disable pointer events to prevent interaction
            background: "#f5f5f5", // Set a background color to indicate it's disabled
            width: "100%"
        }

        const fileLimit = {
            accept: 'image/*', // Accept only image files
        };

        return resultArray.map((referenceData, index) => (
            <div key={index}>
                <Divider />
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name={`REFERENCE_${index + 1}`} label={`Reference ${index + 1}` } initialValue={referenceData.ITEM_ID_AI}>
                            <Select
                                placeholder="Select Reference"
                                allowClear
                                style={disableStyle}
                            >
                                {referenceOptions.map((option) => (
                                    <Option key={option.value} value={option.value} title={option.label}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Status */}
                        <Form.Item
                            name={`STATUS_${index + 1}`}
                            label={`Status ${index + 1}`}
                            rules={[{ required: true, message: 'Please select Status' }]}
                            initialValue={referenceData.STATUS}
                        >
                            <Select style={disableStyle} placeholder="Select Status" showSearch>
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
                        {/* Weight (ct) */}
                        <Form.Item
                            name={`WEIGHT_${index + 1}`}
                            label={`Weight (ct) ${index + 1}`}
                            initialValue={referenceData.WEIGHT}
                        >
                            <InputNumber style={disableStyle} min={0} step={0.01} placeholder="Enter Weight" />
                        </Form.Item>
                    </Col>
                    {referenceData.PHOTO_LINK ? (
                    <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Item
                            label="Photo"
                        >
                            <img
                                alt="Initial Photo"
                                style={{ width: '50%', borderRadius: '5px', cursor: 'pointer' }}
                                src={referenceData.PHOTO_LINK}
                                onClick={() => this.setState({ enlargedImageVisible: true })}
                            />

                            {/* Enlarged view modal */}
                            <Modal
                                visible={this.state.enlargedImageVisible}
                                footer={null}
                                onCancel={() => this.setState({ enlargedImageVisible: false })}
                            >
                                <img
                                    alt="Enlarged View"
                                    style={{ width: '100%' }}
                                    src={referenceData.PHOTO_LINK}
                                    onError={(e) => {
                                        console.error('Image loading error:', e);
                                    }}
                                />
                            </Modal>
                        </Form.Item>
                    </Col>
                    ) : null}
                    <Col xs={24} sm={24} md={24} lg={3}>
                        <Form.Item
                            name={`IS_ELEC_TREATED_${index + 1}`}
                            label={`Is Elec Treated Already ${index + 1}`}
                            initialValue={referenceData.IS_HEAT_TREATED}
                        >
                            <Switch
                                checkedChildren="Elec Treated"
                                unCheckedChildren="Not Treated"
                                disabled
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Status */}
                        <Form.Item
                            name={`AFTER_STATUS_${index + 1}`}
                            label={`Status After ET ${index + 1}`}
                            initialValue="With Electric T"
                        >
                            <Select placeholder="Select Status" showSearch>
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
                        {/* Weight (ct) */}
                        <Form.Item
                            name={`WEIGHT_AFTER_ET_${index + 1}`}
                            label={`Weight (ct) After ET ${index + 1}`}
                            initialValue={referenceData.WEIGHT_AFTER_ET}
                        >
                            <InputNumber min={0} step={0.01} placeholder="Enter Weight" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name={`ET_BY_${index + 1}`}
                            label={`Electric Treated By ${index + 1}`}
                            initialValue={referenceData.ET_BY}
                        >
                            <Select placeholder="Select Customer" style={disableStyle}>
                                {customerOptions.map((option) => (
                                    <Option key={option.value} value={option.value} title={option.label}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {referenceData.PHOTOS_AFTER_ET_LINK ? (
                    <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Item
                            label="Photo After ET"
                        >
                            <img
                                alt="Initial Photo"
                                style={{ width: '50%', borderRadius: '5px', cursor: 'pointer' }}
                                src={referenceData.PHOTOS_AFTER_ET_LINK}
                                onClick={() => this.setState({ enlargedImageVisibleET: true })}
                            />

                            {/* Enlarged view modal */}
                            <Modal
                                visible={this.state.enlargedImageVisibleET}
                                footer={null}
                                onCancel={() => this.setState({ enlargedImageVisibleET: false })}
                            >
                                <img
                                    alt="Enlarged View"
                                    style={{ width: '100%' }}
                                    src={referenceData.PHOTOS_AFTER_ET_LINK}
                                    onError={(e) => {
                                        console.error('Image loading error:', e);
                                    }}
                                />
                            </Modal>
                        </Form.Item>
                    </Col>
                    ) : null}
                    <Col xs={24} sm={24} md={24} lg={3}>
                        {/* File Upload */}
                        <Form.Item
                            name={`PHOTOS_AFTER_ET_LINK_${index + 1}`}
                            label={`Upload Photo After ET ${index + 1}`}
                        >
                            <Upload
                                customRequest={({ onSuccess, onError, file }) => {
                                    onSuccess();
                                }}
                                fileList={this.state.fileList[index] || []}
                                onChange={(info) => this.handleFileChange(info, { index })}
                                {...fileLimit}
                                listType="picture-card"
                                showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                                maxCount={1} // Allow only one file
                                onPreview={() => this.setState({ [`previewVisible${index}`]: true })}
                            >
                                {this.state.fileList[index]?.length >= 1 ? null : (
                                    <div>
                                        <UploadOutlined />
                                        <div className="ant-upload-text">Upload</div>
                                    </div>
                                )}
                            </Upload>
                            {/* Display uploaded image */}
                            <div className="clearfix">
                                <Modal
                                    visible={this.state[`previewVisible${index}`]}
                                    footer={null}
                                    onCancel={() => this.setState({ [`previewVisible${index}`]: false })}
                                >
                                    {this.state[`imgBBLink${index}`] === '' ? (
                                        <div className="loading-indicator">Uploading...</div>
                                    ) : (
                                        <img
                                            alt="Preview"
                                            style={{ width: '100%' }}
                                            src={this.state[`imgBBLink${index}`]}
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
            </div>
        ));
    }


    render() {
        const { referenceOptions,heatTreatmentGroupOptions,customerOptions,fileList1 } = this.state;

        const disableStyle = {
            pointerEvents: "none", // Disable pointer events to prevent interaction
            background: "#f5f5f5", // Set a background color to indicate it's disabled
            width: "100%"
        }

        const fileLimit = {
            accept: 'image/*', // Accept only image files
        };

        return (
            <Form ref={this.formRef} layout="vertical" onFinish={this.handleSubmit}>
                <Row gutter={[16, 16]} justify="left" align="top">
                    {/*<Col xs={24} sm={12} md={12} lg={12}>*/}
                    {/*    <Form.Item*/}
                    {/*        name="NAME"*/}
                    {/*        label="Name"*/}
                    {/*        rules={[{ required: true, message: 'Please enter group name' }]}*/}
                    {/*    >*/}
                    {/*        <Input placeholder="Enter a group name" />*/}
                    {/*    </Form.Item>*/}
                    {/*</Col>*/}
                    <Col xs={24} sm={12} md={12} lg={24}>
                        <Form.Item
                            name="ET_ID"
                            label="Treatment Group"
                            rules={[{ required: true, message: 'Please select Treatment Group' }]}
                        >
                            <Select placeholder="Select Treatment Group" allowClear showSearch
                                    filterOption={(input, option) =>
                                        (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                        (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                    }
                                    onChange={this.loadReferenceFromETGroup}>
                                {heatTreatmentGroupOptions.map((option) => (
                                    <Option key={option.value} value={option.value} title={option.label}>
                                        {option.code}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                            name="ET_BY"
                            label="Electric Treated By"
                            rules={[{ required: true, message: 'Please enter heat treated by' }]}
                        >
                            <Select placeholder="Select Customer" allowClear showSearch onChange={this.handleCustomerChange}
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
                    <Col xs={24} sm={12} md={12} lg={12}>
                        {/* Date */}
                        <Form.Item
                            name="DATE"
                            label="Date"
                            rules={[{ required: true, message: 'Please select Date' }]}  // Set the default date to today
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                            name="REMARK"
                            label="Remarks"
                        >
                            <Input.TextArea rows={2} placeholder="Enter remarks" />
                        </Form.Item>
                    </Col>
                </Row>
                {this.renderFormFields()}
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add Electric Treatment
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default AddElectricTreatment;
