// Lots.js
import React, { Component} from 'react';
import {
    Button,
    Col, Form,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    Select
} from 'antd';
import axios from 'axios';
import LotsTableCard from './LotsTableCard';
import UpdateItemsForm from "../Items/UpdateItemsForm";
import ViewItemsForm  from "../Items/ViewItemsForm";


const { Option } = Select;

class Lots extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            loading: false,
            filteredTableData: [],
            isUpdateModalVisible: false,
            isViewModalVisible: false,
            selectedItem: null,
            tableLotsBuying : [],
            tableLotsMines : [],
            tableLotsSelling  : [],


            searchCode: '',
            searchStatus: '',
            searchItemId: null,
        };

        // Bind methods
        this.handleUpdateShow = this.handleUpdateShow.bind(this);
        this.handleViewShow = this.handleViewShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllLots = this.getAllLots.bind(this);
        this.toggleUpdateModal = this.toggleUpdateModal.bind(this);
        this.toggleViewModal = this.toggleViewModal.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

    }

    componentDidMount() {
        this.getAllLots();
    }

    handleClear = async () => {
        this.setState({ loading: true });

        try {
            // Prepare the search criteria
            const searchData = {
                code: null,
                status: null,
                itemId: null,
            };

            this.formRef.current.resetFields();

            this.setState({
                searchCode: null,
                searchStatus: null,
                searchItemId: null,
            });

            // Make an AJAX request to search for data
            const response = await axios.post('http://localhost:3001/searchLots', searchData);


            if (response.data.success) {
                const filteredItems = response.data.result;

                // Categorize filtered items based on CP_TYPE
                const categorizedTables = {
                    LotsBuying: [],
                    LotsMines: [],
                    LotsSelling: [],
                };

                filteredItems.forEach(item => {
                    const { LOT_TYPE } = item;
                    switch (LOT_TYPE) {
                        case 'Lots Buying':
                            categorizedTables.LotsBuying.push(item);
                            break;
                        case 'Lots Mines':
                            categorizedTables.LotsMines.push(item);
                            break;
                        case 'Lots Selling':
                            categorizedTables.LotsSelling.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableLotsBuying: categorizedTables.LotsBuying,
                    tableLotsMines: categorizedTables.LotsMines,
                    tableLotsSelling: categorizedTables.LotsSelling,
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
    };

    handleSearch = async () => {
        this.setState({ loading: true });

        try {
            // Prepare the search criteria
            const searchData = {
                code: this.state.searchCode,
                status: this.state.searchStatus,
                itemId: this.state.searchItemId,
            };

            this.setState({
                searchCode: null,
                searchStatus: null,
                searchItemId: null,
            });

            // Make an AJAX request to search for data
            const response = await axios.post('http://localhost:3001/searchLots', searchData);


            if (response.data.success) {
                const filteredItems = response.data.result;
                console.log('filteredItems', filteredItems);
                this.formRef.current.resetFields();

                message.info(response.data.message);

                // Categorize filtered items based on LOT_TYPE
                const categorizedTables = {
                    LotsBuying: [],
                    LotsMines: [],
                    LotsSelling: [],
                };

                filteredItems.forEach(item => {
                    const { LOT_TYPE } = item;
                    switch (LOT_TYPE) {
                        case 'Lots Buying':
                            categorizedTables.LotsBuying.push(item);
                            break;
                        case 'Lots Mines':
                            categorizedTables.LotsMines.push(item);
                            break;
                        case 'Lots Selling':
                            categorizedTables.LotsSelling.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableLotsBuying: categorizedTables.LotsBuying,
                    tableLotsMines: categorizedTables.LotsMines,
                    tableLotsSelling: categorizedTables.LotsSelling,
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
    };


    handleUpdateShow(row) {
        console.log('row', row);
        this.setState({
            selectedItem: row,
            isUpdateModalVisible: true,
        });
        console.log('selectedItem', this.state.selectedItem);
    }

    handleViewShow(row) {
        console.log('row', row);
        this.setState({
            selectedItem: row,
            isViewModalVisible: true,
        });
        console.log('selectedItem', this.state.selectedItem);
    }


    handleDelete = async (id) => {
        console.log('id', id);
        try {
            // Make an API call to deactivate the customer
            const response = await axios.post('http://localhost:3001/deactivateItem', {
                ITEM_ID_AI: id,
            });

            if (response.data.success) {
                message.success('Item deleted successfully');
                // Refresh the table
                this.getAllLots();
            } else {
                message.error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            message.error('Internal server error');
        }
    };


    async getAllLots() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://localhost:3001/getAllLots');

            if (response.data.success) {
                const items = response.data.result;
                console.log('items', items);


                // Categorize items based on LOT_TYPE
                const categorizedTables = {
                    LotsBuying: [],
                    LotsMines: [],
                    LotsSelling: [],
                };

                items.forEach(item => {
                    const { LOT_TYPE } = item;
                    switch (LOT_TYPE) {
                        case 'Lots Buying':
                            categorizedTables.LotsBuying.push(item);
                            break;
                        case 'Lots Mines':
                            categorizedTables.LotsMines.push(item);
                            break;
                        case 'Lots Selling':
                            categorizedTables.LotsSelling.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableLotsBuying: categorizedTables.LotsBuying,
                    tableLotsMines: categorizedTables.LotsMines,
                    tableLotsSelling: categorizedTables.LotsSelling,

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



    toggleUpdateModal() {
        this.setState({
            isUpdateModalVisible: !this.state.isUpdateModalVisible,
            selectedItem: null,
        });

        // Reset selectedItem when the modal is canceled
        if (!this.state.isUpdateModalVisible) {
            this.handleUpdateCancel();
        }
    }

    toggleViewModal() {
        this.setState({
            isViewModalVisible: !this.state.isViewModalVisible,
            selectedItem: null,
        });

    }




    handleUpdateCancel = () => {
        this.setState({
            isUpdateModalVisible: false,
            selectedItem: null,
        });
    };




    handleUpdate() {
        // Notify the parent component to refresh the table
        this.getAllLots();

        // Close the update modal
        this.toggleUpdateModal();
    }

    render() {
        return (
            <>
                {/* Search Filter */}
                <div>
                    <Form
                        ref={this.formRef}
                        initialValues={{
                            searchCode: null,
                            searchStatus: null,
                            searchItemId: null,
                        }}
                        onFinish={this.handleSearch}
                    >
                        <Row gutter={[24, 0]}>
                            <Col xs={6} xl={6}>
                                <Form.Item name="searchCode">
                                    <Input
                                        placeholder="Search by Code"
                                        onChange={(e) => this.setState({ searchCode: e.target.value })}
                                        style={{ width: '100%'}}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={6} xl={6}>
                                <Form.Item name="searchStatus">
                                    <Select
                                        placeholder="Filter by Status"
                                        onChange={(value) => this.setState({ searchStatus: value })}
                                        style={{ width: '100%'}}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="Working">Working</Option>
                                        <Option value="Treatment">Treatment</Option>
                                        <Option value="Sold">Sold</Option>
                                        <Option value="Finished">Finished</Option>
                                        <Option value="Stuck">Stuck</Option>
                                        <Option value="With Seller">With Seller</Option>
                                        <Option value="Cutting">Cutting</Option>
                                        <Option value="Ready for Selling">Ready for Selling</Option>
                                        <Option value="Heat Treatment">Heat Treatment</Option>
                                        <Option value="Electric Treatment">Electric Treatment</Option>
                                        <Option value="C&P">C&P</Option>
                                        <Option value="Preformed">Preformed</Option>
                                        <Option value="Added to a lot">Added to a lot</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={6} xl={6}>
                                <Form.Item name="searchItemId">
                                    <InputNumber
                                        placeholder="Filter by Item ID"
                                        onChange={(value) => this.setState({ searchItemId: value })}
                                        style={{ width: '100%'}}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={6} xl={6}>
                                <Form.Item>
                                    <Button type="default" htmlType="submit" style={{ marginRight: '8px' }}>
                                        Filter
                                    </Button>
                                    <Button type="default" danger onClick={this.handleClear} style={{ marginRight: '8px' }}>
                                        Clear
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* Cards and Tables */}
                <div className="tabled">
                    {this.state.tableLotsBuying.length > 0 && (
                    <Row gutter={[24, 0]}>
                        <Col xs="24" xl={24}>
                            <LotsTableCard
                                title="Lots - Buying"
                                backgroundColor="#E2445C"
                                dataSource={this.state.tableLotsBuying}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tableLotsMines.length > 0 && (
                    <Row gutter={[24, 0]}>
                        <Col xs="24" xl={24}>
                            <LotsTableCard
                                title="Lots - Mines"
                                backgroundColor="#A25DDC"
                                dataSource={this.state.tableLotsMines}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tableLotsSelling.length > 0 && (
                    <Row gutter={[24, 0]}>
                        <Col xs="24" xl={24}>
                            <LotsTableCard
                                title="Lots - Selling"
                                backgroundColor="#579AFA"
                                dataSource={this.state.tableLotsSelling}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                </div>

                {/* Update Item Modal */}
                <Modal
                    title="Update Item"
                    visible={this.state.isUpdateModalVisible}
                    onCancel={this.toggleUpdateModal}
                    footer={null}
                    width={1250}
                >
                    {this.state.selectedItem && (
                        <UpdateItemsForm
                            key={this.state.selectedItem.ITEM_ID_AI} // Pass a key to ensure a new instance is created
                            initialValues={this.state.selectedItem}
                            onUpdate={this.getAllLots}
                            onCancel={this.handleUpdateCancel} // Pass the new method here
                        />
                    )}
                </Modal>

                {/* View Item Modal */}
                <Modal
                    title="View Item"
                    visible={this.state.isViewModalVisible}
                    onCancel={this.toggleViewModal}
                    footer={null}
                    width={1250}
                >
                    {this.state.selectedItem && (
                        <ViewItemsForm
                            key={this.state.selectedItem.ITEM_ID_AI} // Pass a key to ensure a new instance is created
                            initialValues={this.state.selectedItem}
                        />
                    )}
                </Modal>

            </>
        );
    }
}

export default Lots;