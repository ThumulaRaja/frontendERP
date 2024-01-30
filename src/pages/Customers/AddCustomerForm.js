import React from 'react';
import {Form, Input, Button, Col, Row, message, Select} from 'antd';
import axios from "axios";
import Cookies from 'js-cookie';


class AddCustomerForm extends React.Component {
    formRef = React.createRef();

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
                IS_ACTIVE: 1,
                CREATED_BY: USER_ID,
            };

            const response = await axios.post('http://35.154.1.99:3001/addCustomer', updatedValues);

            if (response.data.success) {
                message.success('Customer added successfully');

                // Close the modal
                this.props.onClose();

                // Refresh the table
                this.props.refreshTable();

                // You can reset the form if needed
                this.formRef.current.resetFields();
            } else {
                message.error('Failed to add customer');
            }
        } catch (error) {
            console.error('Error adding customer:', error);
            message.error('Internal server error');
        }
    };


    render() {
        return (
            <Form ref={this.formRef} layout="vertical" onFinish={this.handleSubmit}>
                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                            name="NAME"
                            label="Customer Name"
                            rules={[{ required: true, message: 'Please enter customer name' }]}
                        >
                            <Input placeholder="Enter a customer name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                            name="PHONE_NUMBER"
                            label="Phone Number"
                        >
                            <Input placeholder="Enter a phone number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                            name="NIC"
                            label="NIC Number"
                        >
                            <Input placeholder="Enter NIC number" />
                        </Form.Item>
                    </Col>
                </Row>


                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                            name="TYPE"
                            label="Customer Type"
                            initialValue="Seller"  // Corrected typo here
                        >
                            <Select
                                placeholder="Select a customer type"
                            >
                                <Select.Option value="Seller">Seller</Select.Option>
                                <Select.Option value="Buyer">Buyer</Select.Option>
                                <Select.Option value="Sales Person">Sales Person</Select.Option>
                                <Select.Option value="Partner">Partner</Select.Option>
                                <Select.Option value="Performer">Performer</Select.Option>  {/* Corrected typo here */}
                                <Select.Option value="C&P">C&P</Select.Option>
                                <Select.Option value="Electric">Electric</Select.Option>
                                <Select.Option value="Heat T">Heat T</Select.Option>
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                            name="COMPANY"
                            label="Company"
                        >
                            <Input placeholder="Enter a company" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                            name="ADDRESS"
                            label="Customer Address"
                        >
                            <Input.TextArea rows={4} placeholder="Enter a customer address" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} justify="left" align="top">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add Customer
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default AddCustomerForm;
