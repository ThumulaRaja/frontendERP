import React, { Component } from 'react';
import {Button, Card, Col, Divider, Input, message, Modal, Popconfirm, Row, Select, Table, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined} from '@ant-design/icons';
import axios from 'axios';
import AddCutPolish from './AddCutPolish';
import UpdateCutPolish from './UpdateCutPolish';

const { Option } = Select;

const { Search } = Input;

class CutPolish extends Component {
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
        };

        // Bind methods
        this.handleUpdateShow = this.handleUpdateShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllCutPolish = this.getAllCutPolish.bind(this);
        this.toggleAddCustomerModal = this.toggleAddCustomerModal.bind(this);
        this.toggleUpdateCustomerModal = this.toggleUpdateCustomerModal.bind(this);
        this.handleAddCustomer = this.handleAddCustomer.bind(this);
        this.handleUpdateCustomer = this.handleUpdateCustomer.bind(this);

    }

    async componentDidMount() {
        this.getAllCutPolish();
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

        // Filter the table data based on Cut & Polish Code and Cut & Polish Name
        const filteredData = tableData.filter((record) => {
            return record.CODE.toLowerCase().includes(value.toLowerCase());
        });

        this.setState({
            filteredTableData: filteredData,
        });

        if(filteredData.length === 0){
            message.info('No Cut & Polish Found');
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
            // Make an API call to deactivate the Cut & Polish
            const response = await axios.post('http://35.154.1.99:3001/deactivateCP', {
                CP_ID: Id,
            });

            if (response.data.success) {
                message.success('Cut & Polish deleted successfully');
                // Refresh the table
                await this.getAllCutPolish();
            } else {
                message.error('Failed to delete Cut & Polish');
            }
        } catch (error) {
            console.error('Error deleting Cut & Polish:', error);
            message.error('Internal server error');
        }
    };


    async getAllCutPolish() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getAllCutPolish');

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
        // Implement logic to add a new Cut & Polish using the provided values
        console.log('Add Cut & Polish:', values);

        // Close the modal after adding Cut & Polish
        this.toggleAddCustomerModal();
    }

    handleUpdateCustomer() {
        // Notify the parent component to refresh the table
        this.getAllCutPolish();

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
                                title="Cut & Polish"
                                extra={
                                    <>
                                        <Search
                                            placeholder="Search by CP Code"
                                            onSearch={this.handleSearch}
                                            style={{ width: 300, marginRight: '16px' }}
                                            allowClear
                                        />
                                        <Button className="primary" onClick={this.toggleAddCustomerModal}>
                                            <PlusOutlined /> Add Cut & Polish
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
                                                title: 'CP Code',
                                                dataIndex: 'CODE',
                                            },
                                            {
                                                title: 'Item Code',
                                                dataIndex: 'ITEM_CODE',
                                            },
                                            {
                                                title: 'Reference Item Code',
                                                dataIndex: 'REFERENCE_ITEM_CODE',
                                            },
                                            {
                                                title: 'CP By',
                                                dataIndex: 'CP_BY_NAME',
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
      title="Are you sure you want to delete this Cut & Polish?"
      onConfirm={() => this.handleDelete(row.CP_ID)}
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
                    title="Add Cut & Polish"
                    visible={this.state.isAddCustomerModalVisible}
                    onCancel={this.toggleAddCustomerModal}
                    footer={null}
                    width={1100}
                >
                    <AddCutPolish
                        onClose={this.toggleAddCustomerModal}
                        refreshTable={this.getAllCutPolish}
                    />
                </Modal>

                {/* Update Cut & Polish Modal */}
                <Modal
                    title={this.state.formType === 'view' ? 'View Cut & Polish' : 'Update Cut & Polish'}
                    visible={this.state.isUpdateCustomerModalVisible}
                    onCancel={this.toggleUpdateCustomerModal}
                    footer={null}
                    width={1100}
                >
                    {this.state.selectedCustomer && (
                        <UpdateCutPolish
                            key={this.state.selectedCustomer.CP_ID}
                            initialValues={this.state.selectedCustomer}
                            type={this.state.formType}
                            onUpdate={this.getAllCutPolish}
                            onCancel={this.toggleUpdateCustomerModal}
                        />
                    )}
                </Modal>
            </>
        );
    }
}

export default CutPolish;
