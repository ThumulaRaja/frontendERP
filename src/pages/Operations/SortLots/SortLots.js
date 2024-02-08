// /* eslint-disable */
import React, { Component } from 'react';
import {Button, Card, Col, Divider, Input, message, Modal, Popconfirm, Row, Select, Table, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined} from '@ant-design/icons';
import axios from 'axios';
import AddSortLots from './AddSortLots';
import UpdateSortLots from './UpdateSortLots';
import Item from "../../GlobalViewModels/Item";
import Customer from "../../GlobalViewModels/Customer";

const { Option } = Select;

const { Search } = Input;

class SortLots extends Component {
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
            isViewModalCustomerVisible: false,
            isViewItemModalVisible: false,
            selectedRefferenceItem: null,
            selectedCustomer1: null,
        };

        // Bind methods
        this.handleUpdateShow = this.handleUpdateShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllSortLots = this.getAllSortLots.bind(this);
        this.toggleAddCustomerModal = this.toggleAddCustomerModal.bind(this);
        this.toggleUpdateCustomerModal = this.toggleUpdateCustomerModal.bind(this);
        this.handleAddCustomer = this.handleAddCustomer.bind(this);
        this.handleUpdateCustomer = this.handleUpdateCustomer.bind(this);

    }

    async componentDidMount() {
        this.getAllSortLots();
        const referenceOptions = await this.fetchReferenceOptions();
        this.setState({referenceOptions});
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

    handleSearch = (value) => {
        const { tableData } = this.state;

        // Filter the table data based on Sort Lots Code and Sort Lots Name
        const filteredData = tableData.filter((record) => {
            return record.CODE.toLowerCase().includes(value.toLowerCase()) || record.SL_BY_NAME.toLowerCase().includes(value.toLowerCase());
        });

        this.setState({
            filteredTableData: filteredData,
        });

        if(filteredData.length === 0){
            message.info('No Sort Lots Found');
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
            // Make an API call to deactivate the Sort Lots
            const response = await axios.post('http://localhost:3001/deactivateSL', {
                SL_ID: Id,
            });

            if (response.data.success) {
                message.success('Sort Lots deleted successfully');
                // Refresh the table
                await this.getAllSortLots();
            } else {
                message.error('Failed to delete Sort Lots');
            }
        } catch (error) {
            console.error('Error deleting Sort Lots:', error);
            message.error('Internal server error');
        }
    };


    async getAllSortLots() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://localhost:3001/getAllSortLots');

            if (response.data.success) {
                const customers = response.data.result;
                //console.log('customers', customers);

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
        // Implement logic to add a new Sort Lots using the provided values
        //console.log('Add Sort Lots:', values);

        // Close the modal after adding Sort Lots
        this.toggleAddCustomerModal();
    }

    handleUpdateCustomer() {
        // Notify the parent component to refresh the table
        this.getAllSortLots();

        // Close the update modal
        this.toggleUpdateCustomerModal();
    }

    showReferenceItem(itemId){
        //console.log('itemId', itemId);
        this.setState({
            selectedRefferenceItem: itemId,
            isViewItemModalVisible: true,
        });
    }



    showCustomer(customerId){
        this.setState({
            selectedCustomer1: customerId,
            isViewModalCustomerVisible: true,
        });
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
                                title="Sort Lots"
                                extra={
                                    <>
                                        <Search
                                            placeholder="Search by Code or Preformer"
                                            onSearch={this.handleSearch}
                                            style={{ width: 300, marginRight: '16px' }}
                                            allowClear
                                        />
                                        <Button className="primary" onClick={this.toggleAddCustomerModal}>
                                            <PlusOutlined /> Add Sort Lots
                                        </Button>
                                    </>
                                }
                            >
                                <div className="table-responsive">
                                    <Table
                                        className="ant-border-space"
                                        size="small"
                                        style={{ margin: '15px' }}
                                        rowKey="CUSTOMER_ID"
                                        columns={[
                                            {
                                                title: 'SL Code',
                                                dataIndex: 'CODE',
                                            },
                                            {
                                                title: 'Item Code',
                                                dataIndex: 'ITEM_CODE',
                                                render: (text, record) => (
                                                    <Button type="default" style={{ height: 'auto' }}
                                                            onClick={() => this.showReferenceItem(record.ITEM_ID_AI)}>
                                <span>
                <div>{record.ITEM_CODE}</div>
                                </span>
                                                    </Button>
                                                ),
                                            },
                                            {
                                                title: 'Reference Item Code',
                                                dataIndex: 'REF_ITEMS',
                                                width: '40%',
                                                render: (text, record) => {
                                                    // Get the designation IDs from Each Record in text.REF_ITEMS array REFERENCE_ITEM_ID values
                                                    const designationIds = record.REF_ITEMS.map((item) => item.REFERENCE_ITEM_ID);
                                                    //console.log('designationIds', designationIds);
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
                                                title: 'Preformer',
                                                dataIndex: 'SL_BY_NAME',
                                                render: (text, record) => (
                                                    <Button type="default" style={{ height: 'auto'  }} onClick={() => this.showCustomer(record.CUSTOMER_ID)}>
                                <span>
                <div>{record.SL_BY_NAME}</div>
            </span>
                                                    </Button>
                                                ),
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
      title="Are you sure you want to delete this Sort Lots?"
      onConfirm={() => this.handleDelete(row.SL_ID)}
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
                    title="Add Sort Lots"
                    visible={this.state.isAddCustomerModalVisible}
                    onCancel={this.toggleAddCustomerModal}
                    footer={null}
                    width={1100}
                >
                    <AddSortLots
                        onClose={this.toggleAddCustomerModal}
                        refreshTable={this.getAllSortLots}
                    />
                </Modal>

                {/* Update Sort Lots Modal */}
                <Modal
                    title={this.state.formType === 'view' ? 'View Sort Lots' : 'Update Sort Lots'}
                    visible={this.state.isUpdateCustomerModalVisible}
                    onCancel={this.toggleUpdateCustomerModal}
                    footer={null}
                    width={1100}
                >
                    {this.state.selectedCustomer && (
                        <UpdateSortLots
                            key={this.state.selectedCustomer.SL_ID}
                            initialValues={this.state.selectedCustomer}
                            type={this.state.formType}
                            onUpdate={this.getAllSortLots}
                            onCancel={this.toggleUpdateCustomerModal}
                        />
                    )}
                </Modal>

                <Modal
                    title="View Item"
                    visible={this.state.isViewItemModalVisible}
                    onCancel={() => this.setState({ isViewItemModalVisible: false })}
                    footer={null}
                    width={1250}
                >
                    {this.state.selectedRefferenceItem && (
                        <Item
                            key={this.state.selectedRefferenceItem} // Pass a key to ensure a new instance is created
                            itemId={this.state.selectedRefferenceItem}
                        />
                    )}
                </Modal>

                <Modal
                    title="View Customer"
                    visible={this.state.isViewModalCustomerVisible}
                    onCancel={() => this.setState({ isViewModalCustomerVisible: false })}
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

export default SortLots;
