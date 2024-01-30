// /* eslint-disable */
import React, { Component } from 'react';
import {Button, Card, Col, Divider, Input, message, Modal, Popconfirm, Row, Select, Table, Tooltip} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddHT from './AddHT';
import UpdateHT from './UpdateHT';

const { Option } = Select;

const { Search } = Input;

class HT extends Component {
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
        };

        // Bind methods
        this.handleUpdateShow = this.handleUpdateShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllCustomersHT = this.getAllCustomersHT.bind(this);
        this.toggleAddCustomerModal = this.toggleAddCustomerModal.bind(this);
        this.toggleUpdateCustomerModal = this.toggleUpdateCustomerModal.bind(this);
        this.handleAddCustomer = this.handleAddCustomer.bind(this);
        this.handleUpdateCustomer = this.handleUpdateCustomer.bind(this);

    }

    async componentDidMount() {
        this.getAllCustomersHT();
        const referenceOptions = await this.fetchReferenceOptions();
        this.setState({referenceOptions});
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

    handleSearch = (value) => {
        const { tableData } = this.state;

        // Filter the table data based on Heat Treatment Group Code and Heat Treatment Group Name
        const filteredData = tableData.filter((record) => {
            return record.NAME.toLowerCase().includes(value.toLowerCase());
        });

        this.setState({
            filteredTableData: filteredData,
        });

        if(filteredData.length === 0){
            message.info('No Heat Treatment Group Found');
        }
    };

    handleUpdateShow(row) {
        this.setState({
            selectedCustomer: row,
            isUpdateCustomerModalVisible: true,
        });
    }

    handleDelete = async (Id) => {
        try {
            // Make an API call to deactivate the Heat Treatment Group
            const response = await axios.post('http://35.154.1.99:3001/deactivateHT', {
                HT_ID: Id,
            });

            if (response.data.success) {
                message.success('Heat Treatment Group deleted successfully');
                // Refresh the table
                this.getAllCustomersHT();
            } else {
                message.error('Failed to delete Heat Treatment Group');
            }
        } catch (error) {
            console.error('Error deleting Heat Treatment Group:', error);
            message.error('Internal server error');
        }
    };


    async getAllCustomersHT() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getAllHT');

            if (response.data.success) {
                const customers = response.data.result;

                this.setState({
                    tableData: customers,
                });
            } else {
                console.log('Error:', response.data.message);
            }
        } catch (error) {
            console.log('Error:', error.message);
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
        // Implement logic to add a new Heat Treatment Group using the provided values
        console.log('Add Heat Treatment Group:', values);

        // Close the modal after adding Heat Treatment Group
        this.toggleAddCustomerModal();
    }

    handleUpdateCustomer() {
        // Notify the parent component to refresh the table
        this.getAllCustomersHT();

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
                                title="Heat Treatment Group"
                                extra={
                                    <>
                                        <Search
                                            placeholder="Search by Group Name"
                                            onSearch={this.handleSearch}
                                            style={{ width: 300, marginRight: '16px' }}
                                        />
                                        <Button className="primary" onClick={this.toggleAddCustomerModal}>
                                            <PlusOutlined /> Add Heat Treatment Group
                                        </Button>
                                    </>
                                }
                            >
                                <div className="table-responsive">
                                    <Table
                                        className="ant-border-space"
                                        size="small"
                                        style={{ margin: '15px' }}
                                        rowKey="HT_ID"
                                        columns={[
                                            {
                                                title: 'Group Code',
                                                dataIndex: 'CODE',
                                            },
                                            // {
                                            //     title: 'Group Name',
                                            //     dataIndex: 'NAME',
                                            // },
                                            {
                                                title: "References",
                                                dataIndex: "REFERENCE",
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
                                                title: 'Remarks',
                                                dataIndex: 'REMARK',
                                            },
                                            {
                                                title: 'Action',
                                                width: '120px',
                                                align: 'center',
                                                render: (row) => (
                                                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Tooltip title="Edit">
                              <Button
                                  type="primary"
                                  icon={<EditOutlined />}
                                  size="large"
                                  style={buttonStyle}
                                  onClick={() => this.handleUpdateShow(row)}
                              />
                            </Tooltip>
                            <Divider type="vertical" style={{ height: '50px', display: 'flex', alignItems: 'center' }} />
                            <Tooltip title="Delete">
  <Popconfirm
      title="Are you sure you want to delete this Heat Treatment Group?"
      onConfirm={() => this.handleDelete(row.HT_ID)}
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
                    title="Add Heat Treatment Group"
                    visible={this.state.isAddCustomerModalVisible}
                    onCancel={this.toggleAddCustomerModal}
                    footer={null}
                >
                    <AddHT
                        onClose={this.toggleAddCustomerModal}
                        refreshTable={this.getAllCustomersHT}
                    />
                </Modal>

                {/* Update Heat Treatment Group Modal */}
                <Modal
                    title="Update Heat Treatment Group"
                    visible={this.state.isUpdateCustomerModalVisible}
                    onCancel={this.toggleUpdateCustomerModal}
                    footer={null}
                >
                    {this.state.selectedCustomer && (
                        <UpdateHT
                            initialValues={this.state.selectedCustomer}
                            onUpdate={this.getAllCustomersHT}
                            onCancel={this.toggleUpdateCustomerModal}
                        />
                    )}
                </Modal>
            </>
        );
    }
}

export default HT;
