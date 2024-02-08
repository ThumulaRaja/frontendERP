// /* eslint-disable */
import React, { Component } from 'react';
import {Button, Card, Col, Divider, Input, message, Modal, Popconfirm, Row, Select, Table, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined} from '@ant-design/icons';
import axios from 'axios';
import AddElectricTreatment from './AddElectricTreatment';
import UpdateElectricTreatment from './UpdateElectricTreatment';
import Customer from "../../GlobalViewModels/Customer";

const { Option } = Select;

const { Search } = Input;

class ElectricTreatment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            tableData: [],
            filteredTableData: [],
            isAddCustomerModalVisible: false,
            isUpdateCustomerModalVisible: false,
            selectedCustomer: null,
            referenceOptions: [],
            formType: 'view',
            selectedCustomer1: null,
            isViewModalCustomerVisible1: false,
        };

        // Bind methods
        this.handleUpdateShow = this.handleUpdateShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllElecT = this.getAllElecT.bind(this);
        this.toggleAddCustomerModal = this.toggleAddCustomerModal.bind(this);
        this.toggleUpdateCustomerModal = this.toggleUpdateCustomerModal.bind(this);
        this.handleAddCustomer = this.handleAddCustomer.bind(this);
        this.handleUpdateCustomer = this.handleUpdateCustomer.bind(this);

    }

    async componentDidMount() {
        this.getAllElecT();
        const referenceOptions = await this.fetchReferenceOptions();
        this.setState({referenceOptions});
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

    handleSearch = (value) => {
        const { tableData } = this.state;

        // Filter the table data based on Electric Treatment Code and Electric Treatment Name
        const filteredData = tableData.filter((record) => {
            return record.CODE.toLowerCase().includes(value.toLowerCase()) || record.HT_BY_NAME.toLowerCase().includes(value.toLowerCase());
        });

        this.setState({
            filteredTableData: filteredData,
        });

        if(filteredData.length === 0){
            message.info('No Electric Treatment Found');
        }
    };

    handleUpdateShow(row, type) {
        this.setState({
            selectedCustomer: row,
            isUpdateCustomerModalVisible: true,
            formType: type,
        });
    }

    handleDelete = async (Id) => {
        try {
            // Make an API call to deactivate the Electric Treatment
            const response = await axios.post('http://35.154.1.99:3001/deactivateElecT', {
                ELEC_ID: Id,
            });

            if (response.data.success) {
                message.success('Electric Treatment deleted successfully');
                // Refresh the table
                await this.getAllElecT();
            } else {
                message.error('Failed to delete Electric Treatment');
            }
        } catch (error) {
            console.error('Error deleting Electric Treatment:', error);
            message.error('Internal server error');
        }
    };

    showCustomer(customerId){
        this.setState({
            selectedCustomer1: customerId,
            isViewModalCustomerVisible1: true,
        });
    }


    async getAllElecT() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getAllElecT');

            if (response.data.success) {
                const customers = response.data.result;

                this.setState({
                    tableData: customers,
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

    toggleAddCustomerModal() {
        this.setState({
            isAddCustomerModalVisible: !this.state.isAddCustomerModalVisible,
        });
    }

    toggleUpdateCustomerModal() {
        this.setState({
            isUpdateCustomerModalVisible: !this.state.isUpdateCustomerModalVisible,
        });
    }

    handleAddCustomer(values) {
        // Implement logic to add a new Electric Treatment using the provided values
        //console.log('Add Electric Treatment:', values);

        // Close the modal after adding Electric Treatment
        this.toggleAddCustomerModal();
    }

    handleUpdateCustomer() {
        // Notify the parent component to refresh the table
        this.getAllElecT();

        // Close the update modal
        this.toggleUpdateCustomerModal();
    }

    render() {
        const buttonStyle = {
            width: '50px',
            height: '50px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        };

        return (
            <>
                <div className="tabled">
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <Card
                                bordered={false}
                                className="criclebox tablespace mb-24"
                                title="Electric Treatment"
                                extra={
                                    <>
                                        <Search
                                            placeholder="Search by Code or ET By"
                                            onSearch={this.handleSearch}
                                            style={{ width: 300, marginRight: '16px' }}
                                            allowClear
                                        />
                                        <Button className="primary" onClick={this.toggleAddCustomerModal}>
                                            <PlusOutlined /> Add Electric Treatment
                                        </Button>
                                    </>
                                }
                            >
                                <div className="table-responsive">
                                    <Table
                                        className="ant-border-space"
                                        size="small"
                                        style={{ margin: '15px' }}
                                        rowKey="ELEC_ID"
                                        columns={[
                                            {
                                                title: 'ET Code',
                                                dataIndex: 'CODE',
                                            },
                                            // {
                                            //     title: 'HT Name',
                                            //     dataIndex: 'NAME',
                                            // },
                                            {
                                                title: 'ET Group',
                                                dataIndex: 'GROUP_CODE',
                                            },
                                            {
                                                title: 'ET By',
                                                dataIndex: 'HT_BY_NAME',
                                                render: (text, record) => (
                                                    <Button type="default" style={{ height: 'auto'  }} onClick={() => this.showCustomer(record.CUSTOMER_ID)}>
                                <span>
                <div>{record.HT_BY_NAME}</div>
            </span>
                                                    </Button>
                                                ),
                                            },
                                            {
                                                title: "References",
                                                dataIndex: "GROUP_REFERENCE",
                                                width: '40%',
                                                render: (text, record) => {
                                                    const designationIds = text ? text.split(",").map(Number) : [];
                                                    const isDisabled = true; // Set this to true or false based on your condition

                                                    const selectStyle = isDisabled
                                                        ? {
                                                            width: "100%",
                                                            pointerEvents: "none", // Disable pointer events to prevent interaction
                                                            background: "#f5f5f5", // Set a background color to indicate it's disabled
                                                        }
                                                        : { width: "100%" };

                                                    return (
                                                        <Select
                                                            style={selectStyle}
                                                            mode="tags"
                                                            value={designationIds}
                                                            className={`custom-disabled-select ${isDisabled ? "disabled-select" : ""}`}
                                                        >
                                                            {this.state.referenceOptions.map((option) => (
                                                                <Option key={option.value} value={option.value} title={option.label}>
                                                                    {option.label}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    );
                                                },
                                            },
                                            {
                                                title: 'Action',
                                                width: '120px',
                                                align: 'center',
                                                render: (row) => (
                                                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Tooltip titile="View">
                                <Button
                                    type="default"
                                    icon={<EyeOutlined />}
                                    size="large"
                                    style={buttonStyle}
                                    onClick={() => this.handleUpdateShow(row, 'view')}
                                />
                                </Tooltip>
                                                        <Divider type="vertical" style={{ height: '50px', display: 'flex', alignItems: 'center' }} />
                                                        {row.IS_APPROVED === 0 && (
                                                            <Tooltip title="Edit">
                                                                <Button
                                                                    type="primary"
                                                                    icon={<EditOutlined />}
                                                                    size="large"
                                                                    style={buttonStyle}
                                                                    onClick={() => this.handleUpdateShow(row, 'edit')}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                        {row.IS_APPROVED === 0 && (
                                                            <Divider type="vertical" style={{ height: '50px', display: 'flex', alignItems: 'center' }} />
                                                        )}
                            <Tooltip title="Delete">
  <Popconfirm
      title="Are you sure you want to delete this Electric Treatment?"
      onConfirm={() => this.handleDelete(row.ELEC_ID)}
      okText="Yes"
      cancelText="No"
  >
    <Button
        type="primary"
        danger
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
                                        dataSource={
                                            this.state.filteredTableData.length > 0
                                                ? this.state.filteredTableData
                                                : this.state.tableData
                                        }
                                        pagination={true}
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Modal
                    title="Add Electric Treatment"
                    visible={this.state.isAddCustomerModalVisible}
                    onCancel={this.toggleAddCustomerModal}
                    footer={null}
                    width={1100}
                >
                    <AddElectricTreatment
                        onClose={this.toggleAddCustomerModal}
                        refreshTable={this.getAllElecT}
                    />
                </Modal>

                {/* Update Electric Treatment Modal */}
                <Modal
                    title={this.state.formType === 'view' ? 'View Electric Treatment' : 'Update Electric Treatment'}
                    visible={this.state.isUpdateCustomerModalVisible}
                    onCancel={this.toggleUpdateCustomerModal}
                    footer={null}
                    width={1100}
                >
                    {this.state.selectedCustomer && (
                        <UpdateElectricTreatment
                            key={this.state.selectedCustomer.HEAT_ID}
                            initialValues={this.state.selectedCustomer}
                            type={this.state.formType}
                            onUpdate={this.getAllElecT}
                            onCancel={this.toggleUpdateCustomerModal}
                        />
                    )}
                </Modal>

                <Modal
                    title="View Customer"
                    visible={this.state.isViewModalCustomerVisible1}
                    onCancel={() => this.setState({ isViewModalCustomerVisible1: false })}
                    footer={null}
                    width={1250}
                >
                    {this.state.selectedCustomer1 && (
                        <Customer
                            key={this.state.selectedCustomer1} // Pass a key to ensure a new instance is created
                            customerId={this.state.selectedCustomer1}
                        />
                    )}
                </Modal>
            </>
        );
    }
}

export default ElectricTreatment;
