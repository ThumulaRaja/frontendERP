// /* eslint-disable */

import React, { Component } from 'react';
import {
    Card,
    Row,
    Col,
    Select,
} from "antd";
import axios from "axios";


const { Option } = Select;

class ItemURL extends Component {
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


            fileList1: [],  // For the first photo uploader
            previewVisible1: false,
            previewImage1: '',
            imgBBLink1: '',

            fileList2: [],  // For the second photo uploader
            previewVisible2: false,
            previewImage2: '',
            imgBBLink2: '',
        };
        this.getModelItemDetails();
    }

    formRef = React.createRef();


    async getModelItemDetails() {
        try {
            const { match: { params } } = this.props;
            const { code } = params;

            this.setState({ code });
            //console.log('code', code);

            if (code) {
                //console.log('roughId1', code);

            }
            const response = await axios.post('http://35.154.1.99:3001/getItemDetailsUsingCode', { code });

            if (response.data.success) {
                const items = response.data.result;
                //console.log('items', items);
                this.setState({ initialValues: items });
                //console.log('tableTransaction', this.state.initialValues);

                //set the form value
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





    render() {

        return (<>
                <div className="tabled">
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Card
                                className="criclebox tablespace mb-24"
                                title={this.state.initialValues.CODE}
                                style={{ width: '100%' , paddingLeft: '10px'}}
                            >
                                <Row gutter={[16, 16]} justify="left" align="top">
                                    <Col xs={18} sm={12} md={12} lg={3}>
                                        <img src={this.state.initialValues.PHOTO_LINK} alt="Item" style={{ width: '100%' }} />
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Type - {this.state.initialValues.TYPE}</span>
                                    </Col>
                                    {this.state.initialValues.TYPE === 'Rough' && <Col xs={24} sm={24} md={24} lg={24}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Rough Type - {this.state.initialValues.ROUGH_TYPE}</span>
                                    </Col>}
                                    {this.state.initialValues.TYPE === 'Lot' && <Col xs={24} sm={24} md={24} lg={24}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Lot Type - {this.state.initialValues.LOT_TYPE}</span>
                                    </Col>}
                                    {this.state.initialValues.TYPE === 'Sorted Lots' && <Col xs={24} sm={24} md={24} lg={24}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Sorted Lot Type - {this.state.initialValues.SORTED_LOT_TYPE}</span>
                                    </Col>}
                                    {this.state.initialValues.TYPE === 'Cut and Polished' && <Col xs={24} sm={24} md={24} lg={24}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>CP Type - {this.state.initialValues.CP_TYPE}</span>
                                    </Col>}
                                    <Col xs={24} sm={24} md={24} lg={24}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Weight - {this.state.initialValues.WEIGHT}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>No of Pieces - {this.state.initialValues.PIECES}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Is Heat Treated - {this.state.initialValues.IS_HEAT_TREATED === 1 ? 'Yes' : 'No'}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Is Electric Treated - {this.state.initialValues.IS_ELEC_TREATED === 1 ? 'Yes' : 'No'}</span>
                                    </Col>
                                </Row>
                            </Card>

                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default ItemURL;
