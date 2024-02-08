// /* eslint-disable */
import React, { Component } from 'react';
import {Form, Input, Button, Col, Row, message, Select, InputNumber} from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const { Option } = Select;

class AddExpenses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            referenceOptions: [],
        };

        this.formRef = React.createRef();
    }

    async componentDidMount() {
        try {
            const referenceOptions = await this.fetchReferenceOptions();
            this.setState({ referenceOptions });
        } catch (error) {
            console.error('Error fetching reference options:', error);
        }
    }

    async fetchReferenceOptions() {
        try {
            const response = await axios.post('http://localhost:3001/getItemsForReference');
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

    handleSubmit = async (values) => {
        try {
            // Retrieve USER_ID from rememberedUser
            let rememberedUser = Cookies.get('rememberedUser');
            let USER_ID = null;

            if (rememberedUser) {
                rememberedUser = JSON.parse(rememberedUser);
                USER_ID = rememberedUser.USER_ID;
            }


            // Add IS_ACTIVE and CREATED_BY to the values object
            const updatedValues = {
                ...values,
                CREATED_BY: USER_ID,
            };
            //console.log('updatedValues', updatedValues);

            const response = await axios.post('http://localhost:3001/addExpenses', updatedValues);

            if (response.data.success) {
                message.success('Expenses added successfully');

                // Close the modal
                this.props.onClose();

                // Refresh the table
                this.props.refreshTable();

                // You can reset the form if needed
                this.formRef.current.resetFields();
            } else {
                message.error('Failed to add Expenses');
            }
        } catch (error) {
            console.error('Error adding Expenses:', error);
            message.error('Internal server error');
        }
    };

    render() {
        const { referenceOptions } = this.state;

        return (
            <Form ref={this.formRef} layout="vertical" onFinish={this.handleSubmit}>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                            name="AMOUNT"
                            label="Amount (RS)"
                            rules={[{ required: true, message: 'Please enter amount' }]}
                        >
                            <InputNumber min={0} step={0.01} placeholder="Enter Sold Amount" style={{ width : '100%' }}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item name="METHOD" label="Method"
                            rules={[{ required: true, message: 'Please select method' }]}
                                   initialValue={'Cash'}>
                            <Select
                                placeholder="Method"
                                style={{ width: '100%'}}
                                allowClear
                                showSearch
                            >
                                <Option value="Cash">Cash</Option>
                                <Option value="Bank">Bank</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item name="REFERENCE" label="Reference"
                            rules={[{ required: true, message: 'Please select reference' }]}>
                            <Select
                                placeholder="Select Reference"
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option.key
                                        ? option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        : false) ||
                                    (option.title
                                        ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        : false)
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
                </Row>

                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item name="REASON" label="Reason">
                            <Input.TextArea rows={4} placeholder="Enter remarks" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add Expenses
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default AddExpenses;
