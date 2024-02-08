// /* eslint-disable */
import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Row, Col, message, Select} from 'antd';
import axios from 'axios';

const { Option } = Select;


const UpdateHT = ({ initialValues, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [referenceOptions, setReferenceOptions] = useState([]);

    useEffect(() => {
        // Set initial values when the form mounts
        form.setFieldsValue({
            ...initialValues,
            REFERENCE: initialValues.REFERENCE ? initialValues.REFERENCE.split(',').map(Number) : [],
    });
        fetchReferenceOptions();
    }, [form, initialValues]);

    const fetchReferenceOptions = async () => {
        try {
            const response = await axios.post('http://35.154.1.99:3001/getItemsForReference');
            //console.log('response', response);
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
            const referenceString = Array.isArray(values.REFERENCE)
                ? values.REFERENCE.join(',')
                : values.REFERENCE ? values.REFERENCE.toString() : '';

            const updatedValues = {
                ...values,
                HT_ID: initialValues.HT_ID, // Pass the CUSTOMER_ID to identify the customer
                REFERENCE: referenceString,
            };

            // Make API call to update customer
            const response = await axios.post('http://35.154.1.99:3001/updateHT', updatedValues);

            if (response.data.success) {
                message.success('Treatment Group updated successfully');

                // Notify parent component (Treatment Group) about the update
                onUpdate();

                // Close the modal
                onCancel();

                // You can reset the form if needed
                form.resetFields();
            } else {
                message.error('Failed to update customer');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            message.error('Internal server error');
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/*<Row gutter={[16, 16]} justify="left" align="top">*/}
            {/*    <Col xs={24} sm={24} md={24} lg={24}>*/}
            {/*        <Form.Item*/}
            {/*            name="NAME"*/}
            {/*            label="Group Name"*/}
            {/*            rules={[{ required: true, message: 'Please enter group name' }]}*/}
            {/*        >*/}
            {/*            <Input placeholder="Enter a group name" />*/}
            {/*        </Form.Item>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            <Row gutter={[16, 16]} justify="left" align="top">
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item
                        name="REFERENCE"
                        label="Reference"
                        rules={[{ required: true, message: 'Please select reference' }]}
                    >
                        <Select
                            placeholder="Select Reference"
                            mode="multiple"
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
                    <Form.Item name="TYPE" label="Type"
                               rules={[{ required: true, message: 'Please select reference' }]}>
                        <Select
                            placeholder="Select Reference"
                            showSearch>
                            <Option value="Heat Treatment">Heat Treatment</Option>
                            <Option value="Electric Treatment">Electric Treatment</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]} justify="left" align="top">
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item
                        name="REMARK"
                        label="Remarks"
                    >
                        <Input.TextArea rows={4} placeholder="Enter remarks" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]} justify="left" align="top">
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Treatment Group
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default UpdateHT;
