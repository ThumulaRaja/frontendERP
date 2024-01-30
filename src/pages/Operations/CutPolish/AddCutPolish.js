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


class AddCutPolish extends React.Component {
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

    async componentDidMount() {
        try {
            const referenceOptions = await this.fetchReferenceOptions();
            this.setState({ referenceOptions });
            const customerOptions = await this.fetchCustomerOptions();
            this.setState({ customerOptions });
        } catch (error) {
            console.error('Error fetching reference options:', error);
        }
        if(this.props.refe){
            this.loadReferenceCPDetails(this.props.refe);
        }
    }

    async fetchReferenceOptions() {
        try {
            const response = await axios.post('http://35.154.1.99:3001/getItemsForReference');
            console.log('response', response);
            return response.data.result.map((ref) => ({
                value: ref.ITEM_ID_AI,
                label: ref.CODE,
            }));
        } catch (error) {
            console.error('Error fetching reference options:', error);
            return [];
        }
    }



    loadReferenceCPDetails = async (value) => {
        const form = this.formRef.current;
        form.resetFields(['CODE_AFTER_CUTTING']);
        try {
            this.setState({
                imgBBLink2: '',
                fileList2: [],
            });
            const response = await axios.post('http://35.154.1.99:3001/getReferenceCPDetails', {
                ITEM_ID_AI: value,
            });
            if (response.data.success) {
                console.log("response1", response);
                form.setFieldsValue({ CP_TYPE: response.data.result[0].CP_TYPE });
                form.setFieldsValue({ CP_COLOR: response.data.result[0].CP_COLOR });
                form.setFieldsValue({ SHAPE: response.data.result[0].SHAPE });
                form.setFieldsValue({ CP_BY: response.data.result[0].CP_BY });
                form.setFieldsValue({ TOTAL_COST: response.data.result[0].TOTAL_COST });
                form.setFieldsValue({ REMARK: response.data.result[0].REMARK ? response.data.result[0].REMARK : '' });
                if(response.data.result[0].PHOTO){
                    this.setState({ imgBBLink2: response.data.result[0].PHOTO });
                    this.setState({ fileList2: [{
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: response.data.result[0].PHOTO,
                        }] });
                }
                this.setState({ currentCode: response.data.result[0].ITEM_CODE });
            } else {
                message.error('Failed to fetch Item Details');
            }
        } catch (error) {
            console.error("Error fetching reference options:", error);
            return [];
        }
    };

    handleGenerateCode = async () => {
        const form = this.formRef.current;
        const referenceId = form.getFieldValue('REFERENCE_ID_CP');
        console.log('referenceId', referenceId);
        const cpType = form.getFieldValue('CP_TYPE');
        console.log('cpType', cpType);

        if (referenceId !== undefined && cpType !== undefined) {
            const currentCode = this.state.currentCode;

            // Extract numeric part from currentCode
            const match = currentCode.match(/(\d{4})/);

            if (match) {
                const filteredNumber = match[0];

                // Generate new code based on CP_TYPE
                let code;
                switch (cpType) {
                    case 'Blue Sapphire Natural':
                        code = 'BSN' + filteredNumber + 'CP';
                        break;
                    case 'Blue Sapphire Heated':
                        code = 'BSHCP' + filteredNumber;
                        break;
                    case 'Yellow Sapphire':
                        code = 'YSN' + filteredNumber + 'CP';
                        break;
                    case 'Pink Sapphire Natural':
                        code = 'PISNCP' + filteredNumber;
                        break;
                    case 'Pink Sapphire Treated':
                        code = 'PISHCP' + filteredNumber;
                        break;
                    case 'Purple Sapphire Natural':
                        code = 'PSNCP' + filteredNumber;
                        break;
                    case 'Violet Sapphire Natural':
                        code = 'VSN' + filteredNumber + 'CP';
                        break;
                    case 'Blue Sapphire Treated Lots':
                        code = 'BSHLCP' + filteredNumber;
                        break;
                    case 'Padparadscha Sapphire Natural':
                        code = 'PDSN' + filteredNumber + 'CP';
                        break;
                    default:
                        break;
                }
                // Use the generated code as needed (e.g., set it in state, display it, etc.)
                console.log('Generated Code:', code);
                form.setFieldsValue({CODE_AFTER_CUTTING: code});
            }
            else {
                message.error('Could not find a four-digit number in the current code.');
            }
        } else {
            message.error('Please select Reference and Cut and Polished Type');
        }
    };

    clearCode = async (value) => {
        const form = this.formRef.current;
        form.setFieldsValue({CODE_AFTER_CUTTING: ''});
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

                    console.log('this.state', this.state);
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

            // Main data for the request
            const resultArrayData = {
                ...values,
                PHOTO: this.state.imgBBLink2,
                CREATED_BY: USER_ID,
            };


            console.log('resultArrayData', resultArrayData);

            // Send the request
            const response = await axios.post('http://35.154.1.99:3001/addCutPolish', resultArrayData);

            if (response.data.success) {
                message.success('Cut & Polish added successfully');
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
                message.error('Failed to add Cut & Polish');
            }
        } catch (error) {
            console.error('Error adding Cut & Polish:', error);
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

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name="REFERENCE_ID_CP"
                            label="Reference"
                            rules={[{ required: true, message: 'Please select Reference' }]}
                            initialValue={this.props.refe ? this.props.refe : null}
                        >
                            <Select
                                placeholder="Select Item"
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option.key ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false) ||
                                    (option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false)
                                }
                                onChange={this.loadReferenceCPDetails}
                                style={
                                    this.props.refe
                                        ? {
                                            width: '100%',
                                            pointerEvents: 'none', // Disable pointer events to prevent interaction
                                            background: '#ffffff', // Set a background color to indicate it's not editable
                                            color: '#000000', // Set a text color to indicate it's not editable
                                        }
                                        : null
                                }
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
                        {/* Gem Type */}
                        <Form.Item
                            name="CP_TYPE"
                            label="Cut and Polished Type"
                            rules={[{ required: true, message: 'Please select Cut and Polished Type' }]}
                        >
                            <Select placeholder="Select Cut and Polished Type" showSearch onChange={this.clearCode}>
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

                    <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Status */}
                        <Form.Item
                            name="STATUS"
                            label="Status after Cut and Polish"
                            initialValue="C&P"
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
                    <Col xs={24} sm={24} md={24} lg={1}>
                        <Form.Item
                            label=" "
                            name="GENERATE_CODE"
                        >
                            <Button
                                type="default"
                                icon={<RightOutlined />}
                                onClick={this.handleGenerateCode}
                            >
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={5}>
                        <Form.Item
                            name="CODE_AFTER_CUTTING"
                            label="Code After C&P"
                            rules={[{ required: true, message: 'Please genarate Code After C & P' }]}
                        >
                            <Input step={0.01} placeholder="Genarate Code" style={{ width: '100%',
                                pointerEvents: "none", // Disable pointer events to prevent interaction
                                background: "#ffffff", // Set a background color to indicate it's style={inputStyle}
                                color: "#000000", // Set a text color to indicate it's not editable
                            }} />
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
                    <Col xs={24} sm={24} md={24} lg={3}>
                        {/* Weight (ct) */}
                        <Form.Item
                            name="WEIGHT_AFTER_CP"
                            label="Weight CP"
                        >
                            <InputNumber min={0} step={0.01} placeholder="Enter Weight" style={{ width: '100%' }} />
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
                    <Col xs={24} sm={24} md={24} lg={3}>
                        {/* File Upload */}
                        <Form.Item
                            name="PHOTO"
                            label="Upload CP Photo"
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

                    <Col span={15}>
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
                                Add Cut and Polish
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default AddCutPolish;
