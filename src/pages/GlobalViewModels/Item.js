// /* eslint-disable */

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
    Input, Divider, Modal, Table, Tooltip, Popconfirm, message
} from "antd";
import axios from "axios";
import moment from 'moment';
import {DeleteOutlined, ExclamationCircleOutlined, EyeOutlined} from "@ant-design/icons";
import ViewTransactionForm  from "../Transaction/Commen/ViewTransactionForm";
import Cookies from "js-cookie";

const { Option } = Select;

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHeatTreated: false,
        isElectricTreated: false,
            isTransaction: false,
            fileList: [],
            gemType: null,
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
            tableTransaction: [],
            isViewModalVisible: false,
            initialValues: {},

            enlargedImageVisible: false,
            enlargedImageVisibleHT: false,
            enlargedImageVisibleET: false,


            fileList1: [],  // For the first photo uploader
            previewVisible1: false,
            previewImage1: '',
            imgBBLink1: '',

            fileList2: [],  // For the second photo uploader
            previewVisible2: false,
            previewImage2: '',
            imgBBLink2: '',
        };
        this.showProps();
        this.getModelItemDetails();
        this.getAllTransactions();
        this.handleViewShow = this.handleViewShow.bind(this);
        this.toggleViewModal = this.toggleViewModal.bind(this);
    }

    formRef = React.createRef();



    async componentDidMount() {
        // Fetch customer options when the component mounts
        const customerOptions = await this.fetchCustomerOptions();
        this.setState({ customerOptions });
        const heatTreatmentGroupOptions = await this.fetchHTGroupOptions();
        this.setState({ heatTreatmentGroupOptions });
        const ReferenceOptions = await this.fetchReferenceOptions();
        this.setState({ ReferenceOptions });

    }

    async getModelItemDetails() {
        try {
            let id = this.props.itemId;
            //console.log('id', id);
            const response = await axios.post('http://localhost:3001/getItemDetails', { id });

            if (response.data.success) {
                const items = response.data.result;
                //console.log('items', items);
                this.setState({ initialValues: items });
                //console.log('tableTransaction', this.state.initialValues);

                //set the form values
                this.formRef.current.setFieldsValue({
                    CODE: this.state.initialValues.CODE,
                    TYPE: this.state.initialValues.TYPE,
                    STATUS: this.state.initialValues.STATUS,
                    ITEM_ID: this.state.initialValues.ITEM_ID,
                    WEIGHT: this.state.initialValues.WEIGHT,
                    PIECES: this.state.initialValues.PIECES,
                    DATE: this.state.initialValues.DATE ? moment(this.state.initialValues.DATE) : null,
                    POLICY: this.state.initialValues.POLICY ? this.state.initialValues.POLICY.split(',') : undefined,
                    ROUGH_TYPE: this.state.initialValues.ROUGH_TYPE,
                    LOT_TYPE: this.state.initialValues.LOT_TYPE,
                    REFERENCE_ID_LOTS: this.state.initialValues.REFERENCE_ID_LOTS ? this.state.initialValues.REFERENCE_ID_LOTS.split(',').map(Number) : undefined,
                    SORTED_LOT_TYPE: this.state.initialValues.SORTED_LOT_TYPE,
                    FULL_LOT_COST: this.state.initialValues.FULL_LOT_COST,
                    PERFORMER: this.state.initialValues.PERFORMER,
                    CP_TYPE: this.state.initialValues.CP_TYPE,
                    REFERENCE_ID_CP: this.state.initialValues.REFERENCE_ID_CP,
                    TOTAL_COST: this.state.initialValues.TOTAL_COST,
                    CP_BY: this.state.initialValues.CP_BY,
                    CP_COLOR: this.state.initialValues.CP_COLOR,
                    SHAPE: this.state.initialValues.SHAPE,
                    IS_HEAT_TREATED: this.state.initialValues.IS_HEAT_TREATED,
                    HT_ID: this.state.initialValues.HT_ID,
                    WEIGHT_AFTER_HT: this.state.initialValues.WEIGHT_AFTER_HT,
                    HT_BY: this.state.initialValues.HT_BY,
                    PHOTO_LINK: this.state.initialValues.PHOTO_LINK,
                    PHOTOS_AFTER_HT_LINK: this.state.initialValues.PHOTOS_AFTER_HT_LINK,
                    IS_ELEC_TREATED: this.state.initialValues.IS_ELEC_TREATED,
                    ET_ID: this.state.initialValues.ET_ID,
                    WEIGHT_AFTER_ET: this.state.initialValues.WEIGHT_AFTER_ET,
                    ET_BY: this.state.initialValues.ET_BY,
                    PHOTOS_AFTER_ET_LINK: this.state.initialValues.PHOTOS_AFTER_ET_LINK,
                    SELLER: this.state.initialValues.SELLER,
                    COST: this.state.initialValues.COST,
                    GIVEN_AMOUNT: this.state.initialValues.GIVEN_AMOUNT,
                    PAYMENT_METHOD: this.state.initialValues.PAYMENT_METHOD,
                    IS_TRANSACTION: this.state.initialValues.IS_TRANSACTION,
                    SHARE_HOLDERS: this.state.initialValues.SHARE_HOLDERS ? this.state.initialValues.SHARE_HOLDERS.split(',').map(Number) : undefined,
                    OTHER_SHARES: this.state.initialValues.OTHER_SHARES,
                    COMMENTS: this.state.initialValues.COMMENTS,
                    EXPENSE_AMOUNT: this.state.initialValues.EXPENSE_AMOUNT,
                    BUYER: this.state.initialValues.BUYER,
                    BEARER: this.state.initialValues.BEARER,
                    DATE_SOLD: this.state.initialValues.DATE_SOLD ? moment(this.state.initialValues.DATE_SOLD) : null,
                    SOLD_AMOUNT: this.state.initialValues.SOLD_AMOUNT,
                    AMOUNT_RECEIVED: this.state.initialValues.AMOUNT_RECEIVED,
                    DUE_AMOUNT: this.state.initialValues.DUE_AMOUNT,
                    PAYMENT_ETA_START: this.state.initialValues.PAYMENT_ETA_START ? moment(this.state.initialValues.PAYMENT_ETA_START) : null,
                    PAYMENT_ETA_END: this.state.initialValues.PAYMENT_ETA_END ? moment(this.state.initialValues.PAYMENT_ETA_END) : null,
                    DATE_FINISHED: this.state.initialValues.DATE_FINISHED ? moment(this.state.initialValues.DATE_FINISHED) : null,
                });
            } else {
                //console.log('Error:', response.data.message);
            }
        } catch (error) {
            //console.log('Error:', error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    }



    async getAllTransactions() {
        this.setState({ loading: true });

        try {
            let id = this.props.itemId;
            //console.log('id1', id);
            const response = await axios.post('http://localhost:3001/getAllTransactions', { id });

            if (response.data.success) {
                const items = response.data.result;
                //console.log('items', items);
                this.setState({ tableTransaction: items });
                //console.log('tableTransaction1', this.state.tableTransaction);
            } else {
                //console.log('Error:', response.data.message);
            }
        } catch (error) {
            //console.log('Error:', error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    }

    showProps = () => {
        //console.log("this.props",this.props);
    }


    handleSwitchChange = (checked) => {
        this.setState({ isHeatTreated: checked });
    }

    handleSwitchChangeTR = (checked) => {
        this.setState({ isTransaction: checked });
    }

    toggleViewModal() {
        this.setState({
            isViewModalVisible: !this.state.isViewModalVisible,
            selectedItem: null,
        });
    }



    async fetchCustomerOptions() {
        try {
            const response = await axios.post("http://localhost:3001/getAllCustomers");
            //console.log("response123", response);

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

            this.setState({ buyerOptions, sellerOptions, salesPersonOptions, partnerOptions, htByOptions, cpByOptions, preformerOptions,etByOptions });
            //console.log("partnerOptions", this.state.partnerOptions);

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
            console.error("Error fetching refererance options:", error);
            return [];
        }
    }

    async fetchHTGroupOptions() {
        try {
            const response = await axios.post("http://localhost:3001/getAllHT");
            //console.log("response", response);
            return response.data.result.map((ht) => ({
                value: ht.HT_ID,
                label: ht.CODE,
            }));
        } catch (error) {
            console.error("Error fetching Treatment Group Options:", error);
            return [];
        }
    }


    handleGemTypeChange = (gemType) => {
        this.setState({ gemType });
    };

    handleDeleteTranscation = async (id, all) => {
        //console.log('id', id);
        //console.log('all', all);
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

    handleViewShow(row) {
        //console.log('row', row);
        this.setState({
            selectedItem: row,
            isViewModalVisible: true,
        });
        //console.log('selectedItem', this.state.selectedItem);
    }


    render() {

        const inputStyle = {
            width: '100%',
            pointerEvents: "none", // Disable pointer events to prevent interaction
            background: "#ffffff", // Set a background color to indicate it's style={inputStyle}
            color: "#000000", // Set a text color to indicate it's not editable
        };

        const buttonStyle = {
            width: '50px',
            height: '50px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        };

        let rememberedUser = Cookies.get('rememberedUser');
        let ROLE = null;

        if (rememberedUser) {
            rememberedUser = JSON.parse(rememberedUser);
            ROLE = rememberedUser.ROLE;
        }


        const showDeleteAllPaymentsConfirm = (itemId) => {
            Modal.confirm({
                title: 'Do you want to delete the transaction with its all payments?',
                icon: <ExclamationCircleOutlined />,
                width: '600px',
                content: (
                    <div>
                        'This action will permanently delete the transaction and all associated payments.'
                        <Button
                            type="primary"
                            style={{ float: 'right', marginTop: '20px' }}
                            onClick={() => { this.handleDeleteTranscation(itemId, true); Modal.destroyAll(); }}
                        >
                            Yes, Delete All Payments
                        </Button>
                        <Button
                            danger
                            style={{ float: 'left', marginTop: '20px' }}
                            onClick={() => { this.handleDeleteTranscation(itemId, false); Modal.destroyAll(); }}
                        >
                            Only Delete Transaction
                        </Button>
                    </div>
                ),
                footer: null,
                closable: true,
            });
        };

        const {  gemType, customerOptions,heatTreatmentGroupOptions,ReferenceOptions,tableTransaction } = this.state;
        return (<>
                <div className="tabled">
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <Card
                                className="criclebox tablespace mb-24"
                                title={this.state.initialValues.CODE}
                            >
                                <Form
                                    layout="vertical"
                                    style={{ margin: '20px' }}
                                    ref={this.formRef}
                                >
                                    <Row gutter={[16, 16]} justify="left" align="top">
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            {/* No of Pieces */}
                                            <Form.Item
                                                name="CODE"
                                                label="Item Code"
                                                initialValue={this.state.initialValues.CODE}
                                                rules={[{ required: true, message: 'Please item Code Type' }]}
                                            >
                                                <Input style={inputStyle}  placeholder="Enter ID"/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
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
                                                    style={inputStyle}
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
                                                initialValue={this.state.initialValues.STATUS}
                                                rules={[{ required: true, message: 'Please select Status' }]}
                                            >
                                                <Select style={inputStyle} placeholder="Select Status">
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


                                        <Col xs={24} sm={24} md={24} lg={6}>
                                            {/* Weight (ct) */}
                                            <Form.Item
                                                name="WEIGHT"
                                                label="Weight (ct)"
                                                initialValue={this.state.initialValues.WEIGHT}
                                            >
                                                <InputNumber style={inputStyle} min={0} step={0.01} placeholder="Enter Weight"/>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            {/* No of Pieces */}
                                            <Form.Item
                                                name="PIECES"
                                                label="No of Pieces"
                                                type="number"
                                                initialValue={this.state.initialValues.PIECES}

                                            >
                                                <InputNumber style={inputStyle} min={0} placeholder="Enter Pieces"/>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            {/* Date */}
                                            <Form.Item
                                                name="DATE"
                                                label="Date"
                                                initialValue={this.state.initialValues.DATE ? moment(this.state.initialValues.DATE) : null}
                                            >
                                                <DatePicker style={inputStyle}/>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            {/* Gem Type */}
                                            <Form.Item
                                                name="POLICY"
                                                label="Policy"
                                                initialValue={this.state.initialValues.POLICY ? this.state.initialValues.POLICY.split(',') : undefined}
                                            >
                                                <Select placeholder="Select Policy" mode="multiple" style={inputStyle}>
                                                    <Option value="Given">Given</Option>
                                                    <Option value="Bought">Bought</Option>
                                                    <Option value="From Lot">From Lot</Option>
                                                    <Option value="Share">Share</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        {this.state.initialValues.PHOTO_LINK && (
                                            <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Form.Item
                                                    label="Photo"
                                                >
                                                    {/* Display initial photo */}
                                                    {this.state.initialValues.PHOTO_LINK && (
                                                        <img
                                                            alt="Initial Photo"
                                                            style={{ width: '100%', borderRadius: '5px', cursor: 'pointer' }}
                                                            src={this.state.initialValues.PHOTO_LINK}
                                                            onClick={() => this.setState({ enlargedImageVisible: true })}
                                                        />
                                                    )}

                                                    {/* Enlarged view modal */}
                                                    <Modal
                                                        visible={this.state.enlargedImageVisible}
                                                        footer={null}
                                                        onCancel={() => this.setState({ enlargedImageVisible: false })}
                                                    >
                                                        {this.state.initialValues.PHOTO_LINK && (
                                                            <img
                                                                alt="Enlarged View"
                                                                style={{ width: '100%' }}
                                                                src={this.state.initialValues.PHOTO_LINK}
                                                                onError={(e) => {
                                                                    console.error('Image loading error:', e);
                                                                }}
                                                            />
                                                        )}
                                                    </Modal>
                                                </Form.Item>
                                            </Col>
                                        )}


                                    </Row>
                                    <Divider />

                                    {gemType === 'Rough' && (
                                        <Row gutter={[16, 16]} justify="left" align="top">
                                            <Col xs={24} sm={24} md={24} lg={24}>
                                                {/* Gem Type */}
                                                <Form.Item
                                                    name="ROUGH_TYPE"
                                                    label="Rough Gem Type"
                                                    initialValue={this.state.initialValues.ROUGH_TYPE}
                                                    rules={[{ required: true, message: 'Please select Rough Gem Type' }]}
                                                >
                                                    <Select placeholder="Select Rough Gem Type" style={inputStyle}>
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
                                                    initialValue={this.state.initialValues.LOT_TYPE}
                                                    rules={[{ required: true, message: 'Please select Lot Type' }]}
                                                >
                                                    <Select placeholder="Select Lot Type" style={inputStyle}>
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
                                                    initialValue={
                                                        this.state.initialValues.REFERENCE_ID_LOTS
                                                            ? this.state.initialValues.REFERENCE_ID_LOTS.split(',').map(Number)
                                                            : undefined
                                                    }                                                >
                                                    <Select placeholder="Select Reference"
                                                            mode="multiple" style={inputStyle}>
                                                        {ReferenceOptions.map((option) => (
                                                            <Option key={option.value} value={option.value}>
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
                                                    initialValue={this.state.initialValues.SORTED_LOT_TYPE}
                                                    rules={[{ required: true, message: 'Please select Sorted Lot Type' }]}
                                                >
                                                    <Select placeholder="Select Sorted Lot Type" style={inputStyle}>
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
                                                    initialValue={
                                                        this.state.initialValues.REFERENCE_ID_LOTS
                                                            ? this.state.initialValues.REFERENCE_ID_LOTS.split(',').map(Number)
                                                            : undefined
                                                    }                                                        >
                                                    <Select placeholder="Select Reference" mode="multiple" style={inputStyle}>
                                                        {ReferenceOptions.map((option) => (
                                                            <Option key={option.value} value={option.value}>
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
                                                    <InputNumber min={0} step={0.01} placeholder="Enter Lot Cost" style={inputStyle}/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12} md={12} lg={12}>
                                                <Form.Item
                                                    name="PERFORMER"
                                                    label="Preformer"
                                                    initialValue={this.state.initialValues.PERFORMER}
                                                >
                                                    <Select placeholder="Select Preformer" style={inputStyle}>
                                                        {this.state.preformerOptions.map((option) => (
                                                            <Option key={option.value} value={option.value}>
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
                                                    initialValue={this.state.initialValues.CP_TYPE}
                                                    rules={[{ required: true, message: 'Please select Cut and Polished Type' }]}
                                                >
                                                    <Select placeholder="Select Cut and Polished Type" style={inputStyle}>
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
                                                    initialValue={this.state.initialValues.REFERENCE_ID_CP}
                                                >
                                                    <Select placeholder="Select Item" style={inputStyle}>
                                                        {ReferenceOptions.map((option) => (
                                                            <Option key={option.value} value={option.value}>
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
                                                    initialValue={this.state.initialValues.TOTAL_COST}
                                                >
                                                    <InputNumber min={0} step={0.01} placeholder="Enter Total Cost" style={inputStyle}/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} lg={6}>
                                                <Form.Item
                                                    name="CP_BY"
                                                    label="Cutting & Polished By"
                                                    initialValue={this.state.initialValues.CP_BY}
                                                >
                                                    <Select placeholder="Select Customer" style={inputStyle}>
                                                        {this.state.cpByOptions.map((option) => (
                                                            <Option key={option.value} value={option.value}>
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
                                                    initialValue={this.state.initialValues.CP_COLOR}
                                                >
                                                    <Input  placeholder="Enter Color" style={inputStyle}/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} lg={6}>
                                                <Form.Item
                                                    name="SHAPE"
                                                    label="Shape"
                                                    initialValue={this.state.initialValues.SHAPE}
                                                >
                                                    <Select placeholder="Select Shape" style={inputStyle}>
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
                                                initialValue={this.state.initialValues.IS_HEAT_TREATED}
                                            >
                                                <Switch
                                                    checkedChildren="Heat Treated"
                                                    unCheckedChildren="Not Heat Treated"
                                                    onChange={this.handleSwitchChange}
                                                    disabled
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="HT_ID"
                                                label="Treatment Group"
                                                initialValue={this.state.initialValues.HT_ID}
                                            >
                                                <Select placeholder="Select Treatment Group" style={inputStyle}>
                                                    {heatTreatmentGroupOptions.map((option) => (
                                                        <Option key={option.value} value={option.value}>
                                                            {option.label}
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
                                                initialValue={this.state.initialValues.WEIGHT_AFTER_HT}
                                                rules={[
                                                    { type: 'number', message: 'Please enter a valid number' },
                                                ]}
                                            >
                                                <InputNumber  min={0} step={0.01} placeholder="Enter Weight" style={inputStyle} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="HT_BY"
                                                label="Heat Treated By"
                                                initialValue={this.state.initialValues.HT_BY}
                                            >
                                                <Select placeholder="Select Customer" style={inputStyle}>
                                                    {this.state.htByOptions.map((option) => (
                                                        <Option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        {this.state.initialValues.PHOTOS_AFTER_HT_LINK && this.state.initialValues.IS_HEAT_TREATED && (
                                            <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Form.Item
                                                    label="Photo After HT"
                                                >
                                                    {/* Display initial photo */}
                                                    {this.state.initialValues.PHOTOS_AFTER_HT_LINK && (
                                                        <img
                                                            alt="Initial Photo"
                                                            style={{ width: '100%', borderRadius: '5px', cursor: 'pointer' }}
                                                            src={this.state.initialValues.PHOTOS_AFTER_HT_LINK}
                                                            onClick={() => this.setState({ enlargedImageVisibleHT: true })}
                                                        />
                                                    )}

                                                    {/* Enlarged view modal */}
                                                    <Modal
                                                        visible={this.state.enlargedImageVisibleHT}
                                                        footer={null}
                                                        onCancel={() => this.setState({ enlargedImageVisibleHT: false })}
                                                    >
                                                        {this.state.initialValues.PHOTOS_AFTER_HT_LINK && (
                                                            <img
                                                                alt="Enlarged View"
                                                                style={{ width: '100%' }}
                                                                src={this.state.initialValues.PHOTOS_AFTER_HT_LINK}
                                                                onError={(e) => {
                                                                    console.error('Image loading error:', e);
                                                                }}
                                                            />
                                                        )}
                                                    </Modal>
                                                </Form.Item>
                                            </Col>
                                        )}
                                    </Row>

                                    <Divider />

                                    <Row gutter={[16, 16]} justify="left" align="top">
                                        <Col xs={24} sm={24} md={24} lg={3}>
                                            <Form.Item
                                                name="IS_ELEC_TREATED"
                                                label="Is Electric Treated"
                                                initialValue={this.state.initialValues.IS_ELEC_TREATED}
                                            >
                                                <Switch
                                                    checkedChildren="Heat Treated"
                                                    unCheckedChildren="Not Heat Treated"
                                                    // onChange={this.handleSwitchChange}
                                                    disabled
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="ET_ID"
                                                label="Treatment Group"
                                                initialValue={this.state.initialValues.ET_ID}
                                            >
                                                <Select placeholder="Select Treatment Group" style={inputStyle}>
                                                    {heatTreatmentGroupOptions.map((option) => (
                                                        <Option key={option.value} value={option.value}>
                                                            {option.label}
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
                                                initialValue={this.state.initialValues.WEIGHT_AFTER_ET}
                                                rules={[
                                                    { type: 'number', message: 'Please enter a valid number' },
                                                ]}
                                            >
                                                <InputNumber  min={0} step={0.01} placeholder="Enter Weight" style={inputStyle} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="ET_BY"
                                                label="Electric Treated By"
                                                initialValue={this.state.initialValues.ET_BY}
                                            >
                                                <Select placeholder="Select Customer" style={inputStyle}>
                                                    {this.state.etByOptions.map((option) => (
                                                        <Option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        {this.state.initialValues.PHOTOS_AFTER_ET_LINK && this.state.initialValues.IS_ELEC_TREATED && (
                                            <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Form.Item
                                                    label="Photo After HT"
                                                >
                                                    {/* Display initial photo */}
                                                    {this.state.initialValues.PHOTOS_AFTER_ET_LINK && (
                                                        <img
                                                            alt="Initial Photo"
                                                            style={{ width: '100%', borderRadius: '5px', cursor: 'pointer' }}
                                                            src={this.state.initialValues.PHOTOS_AFTER_ET_LINK}
                                                            onClick={() => this.setState({ enlargedImageVisibleET: true })}
                                                        />
                                                    )}

                                                    {/* Enlarged view modal */}
                                                    <Modal
                                                        visible={this.state.enlargedImageVisibleET}
                                                        footer={null}
                                                        onCancel={() => this.setState({ enlargedImageVisibleET: false })}
                                                    >
                                                        {this.state.initialValues.PHOTOS_AFTER_ET_LINK && (
                                                            <img
                                                                alt="Enlarged View"
                                                                style={{ width: '100%' }}
                                                                src={this.state.initialValues.PHOTOS_AFTER_ET_LINK}
                                                                onError={(e) => {
                                                                    console.error('Image loading error:', e);
                                                                }}
                                                            />
                                                        )}
                                                    </Modal>
                                                </Form.Item>
                                            </Col>
                                        )}
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
                                                initialValue={this.state.initialValues.SELLER}
                                                rules={[
                                                    {
                                                        required: this.state.isTransaction,
                                                        message: 'Please enter Seller',
                                                    },
                                                ]}
                                            >
                                                <Select placeholder="Select Customer" style={inputStyle}>
                                                    {this.state.sellerOptions.map((option) => (
                                                        <Option key={option.value} value={option.value}>
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
                                                initialValue={this.state.initialValues.COST}
                                                rules={[
                                                    {
                                                        required: this.state.isTransaction,
                                                        message: 'Please enter Cost',
                                                    },
                                                ]}
                                            >
                                                <InputNumber  min={0} step={0.01} placeholder="Enter Cost" style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={3}>
                                            <Form.Item
                                                name="GIVEN_AMOUNT"
                                                label="Amount Given"
                                                type="number"
                                                initialValue={this.state.initialValues.GIVEN_AMOUNT}
                                                rules={[
                                                    {
                                                        required: this.state.isTransaction,
                                                        message: 'Please enter Given Amount',
                                                    },
                                                ]}
                                            >
                                                <InputNumber  min={0} step={0.01} placeholder="Enter Amount" style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            {/* Gem Type */}
                                            <Form.Item
                                                name="PAYMENT_METHOD"
                                                label="Transaction Method"
                                                initialValue={this.state.initialValues.PAYMENT_METHOD}
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
                                                label="Add Buying Details as a Transaction"
                                                initialValue={this.state.initialValues.IS_TRANSACTION}
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
                                            <Form.Item
                                                name="SHARE_HOLDERS"
                                                label="Share Holders"
                                                initialValue={this.state.initialValues.SHARE_HOLDERS ? this.state.initialValues.SHARE_HOLDERS.split(',').map(Number) : undefined}
                                            >
                                                <Select
                                                    placeholder="Select Share Holders"
                                                    style={inputStyle} // Ensure that 'inputStyle' is defined
                                                    mode="multiple"
                                                >
                                                    {this.state.partnerOptions.map((option) => (
                                                        <Select.Option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={3}>
                                            <Form.Item
                                                name="SHARE_PERCENTAGE"
                                                label="Share Percentage %"
                                                initialValue={this.state.initialValues.SHARE_PERCENTAGE}
                                            >
                                                <InputNumber  min={0} max={100} placeholder="Enter Share" style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={12} lg={12}>
                                            <Form.Item
                                                name="OTHER_SHARES"
                                                label="Other Shares"
                                                initialValue={this.state.initialValues.OTHER_SHARES}
                                            >
                                                <Input   placeholder="Enter Other Shares" style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} justify="left" align="top">
                                        <Col xs={24} sm={24} md={24} lg={24}>
                                            <Form.Item
                                                name="COMMENTS"
                                                label="Comments"
                                                initialValue={this.state.initialValues.COMMENTS}
                                            >
                                                <Input.TextArea rows={2} placeholder="Enter comments" style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24}>
                                            <Form.Item
                                                name="EXPENSE_AMOUNT"
                                                label="Total Expense Amount"
                                                initialValue={this.state.initialValues.EXPENSE_AMOUNT}
                                            >
                                                <InputNumber min={0} step={0.01} placeholder="Enter Expense Amount" style={inputStyle}/>
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
                                            <Form.Item name="BUYER" label="Buyer" initialValue={this.state.initialValues.BUYER}>
                                                <Select placeholder="Select Buyer" style={inputStyle}>
                                                    {this.state.buyerOptions.map((option) => (
                                                        <Option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={12} md={12} lg={12}>
                                            <Form.Item name="BEARER" label="Bearer" initialValue={this.state.initialValues.BEARER}>
                                                <Select placeholder="Select Bearer" style={inputStyle}>
                                                    {this.state.salesPersonOptions.map((option) => (
                                                        <Option key={option.value} value={option.value}>
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
                                                initialValue={this.state.initialValues.DATE_SOLD? moment(this.state.initialValues.DATE_SOLD):null}
                                            >
                                                <DatePicker style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="SOLD_AMOUNT"
                                                label="Sold Amount"
                                                initialValue={this.state.initialValues.SOLD_AMOUNT}
                                            >
                                                <InputNumber min={0} placeholder="Enter Sold Amount" style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="AMOUNT_RECEIVED"
                                                label="Amount Received"
                                                initialValue={this.state.initialValues.AMOUNT_RECEIVED}
                                            >
                                                <InputNumber min={0} placeholder="Enter Amount Received" style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="DUE_AMOUNT"
                                                label="Due Amount"
                                                initialValue={this.state.initialValues.DUE_AMOUNT}
                                            >
                                                <InputNumber min={0} placeholder="Enter Due Amount" style={inputStyle}/>
                                            </Form.Item>
                                        </Col>

                                        {/* Payment ETA - Start, Payment ETA - End, Date Finished */}
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="PAYMENT_ETA_START"
                                                label="Payment ETA - Start"
                                                initialValue={this.state.initialValues.PAYMENT_ETA_START? moment(this.state.initialValues.PAYMENT_ETA_START):null}
                                            >
                                                <DatePicker style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="PAYMENT_ETA_END"
                                                label="Payment ETA - End"
                                                initialValue={this.state.initialValues.PAYMENT_ETA_END? moment(this.state.initialValues.PAYMENT_ETA_END):null}
                                            >
                                                <DatePicker style={inputStyle}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <Form.Item
                                                name="DATE_FINISHED"
                                                label="Date Finished"
                                                initialValue={this.state.initialValues.DATE_FINISHED? moment(this.state.initialValues.DATE_FINISHED):null}
                                            >
                                                <DatePicker style={inputStyle}/>
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                </Form>
                            </Card>
                            {ROLE === 'ADMIN' && (
                            <Card
                                className="criclebox tablespace mb-24"
                                title={"Transaction Details Related To " + this.state.initialValues.CODE}
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
                                                title: 'Method',
                                                dataIndex: 'METHOD'
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
                                            // {
                                            //     title: 'Reference Item',
                                            //     dataIndex: 'ITEM_CODE',
                                            // },
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
                  <Divider
                      type="vertical"
                      style={{ height: '50px', display: 'flex', alignItems: 'center' }}
                  />
                  <Tooltip title="Delete">
                    <Popconfirm
                        title={`Are you sure you want to delete this transaction?`}
                        onConfirm={() => showDeleteAllPaymentsConfirm(row.TRANSACTION_ID)}
                        okText="Yes"
                        cancelText="No"
                    >
    <Button
        danger
        type="primary"
        icon={<DeleteOutlined />}
        size="large"
        style={buttonStyle}
    />
</Popconfirm>
                  </Tooltip>
                </span>
                                                ),
                                            },
                                        ]}
                                        dataSource={tableTransaction}
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
                            </Card>
                            )}

                        </Col>
                    </Row>
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
            </>
        );
    }
}

export default Item;
