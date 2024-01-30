// /* eslint-disable */
import React, { useEffect, useState } from 'react';
import {Form, Input, Button, Row, Col, message, Select, InputNumber} from 'antd';
import axios from 'axios';

const { Option } = Select;

const UpdateExpenses = ({ initialValues, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [referenceOptions, setReferenceOptions] = useState([]);

    useEffect(() => {
        // Set initial values when the form mounts
        form.setFieldsValue({
            ...initialValues,});

        // Fetch reference options
        fetchReferenceOptions();
    }, [form, initialValues]);

    const fetchReferenceOptions = async () => {
        try {
            const response = await axios.post('http://35.154.1.99:3001/getItemsForReference');
            console.log('response', response);
            const options = response.data.result.map((ref) => ({
                value: ref.ITEM_ID_AI,
                label: ref.CODE,
            }));
            setReferenceOptions(options);
        } catch (error) {
            console.error('Error fetching reference options:', error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            // Add IS_ACTIVE to the values object

            const updatedValues = {
                ...values,
                EXPENSES_ID: initialValues.EXPENSES_ID, // Pass the CUSTOMER_ID to identify the Expenses
                OLD_AMOUNT: initialValues.AMOUNT,
                OLD_REFERENCE: initialValues.REFERENCE,
            };

            // Make API call to update Expenses
            const response = await axios.post('http://35.154.1.99:3001/updateExpenses', updatedValues);

            if (response.data.success) {
                message.success('Expenses updated successfully');

                // Notify parent component (Expenses) about the update
                onUpdate();

                // Close the modal
                onCancel();

                // You can reset the form if needed
                form.resetFields();
            } else {
                message.error('Failed to update Expenses');
            }
        } catch (error) {
            console.error('Error updating Expenses:', error);
            message.error('Internal server error');
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                    <Form.Item
                        name="REFERENCE"
                        label="Reference"
                        rules={[{ required: true, message: 'Please select reference' }]}
                    >
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
                            Update Expenses Details
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default UpdateExpenses;
