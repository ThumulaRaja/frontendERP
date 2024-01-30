// /* eslint-disable */
import React, { Component } from 'react';
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
import RoughTableCard from './RoughTableCard';
import UpdateItemsForm from "../Items/UpdateItemsForm";
import ViewItemsForm  from "../Items/ViewItemsForm";
import { withRouter } from 'react-router-dom';


const { Option } = Select;

class Rough extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            loading: false,
            tableData: [],
            filteredTableData: [],
            isUpdateModalVisible: false,
            isViewModalVisible: false,
            selectedItem: null,
            code: null,
            tableDataBlueSapphireNatural : [],
            tableDataBlueSapphireGeuda : [],
            tableDataYellowSapphire  : [],
            tablePinkSapphireNatural : [],
            tablePurpleSapphireNatural : [],
            tableVioletSapphire : [],
            tablePadparadschaSapphire : [],
            tableMix : [],
            tableFancy : [],

            searchCode: '',
            searchStatus: '',
            searchItemId: null,
        };



        // Bind methods
        this.handleUpdateShow = this.handleUpdateShow.bind(this);
        this.handleViewShow = this.handleViewShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllRough = this.getAllRough.bind(this);
        this.toggleUpdateModal = this.toggleUpdateModal.bind(this);
        this.toggleViewModal = this.toggleViewModal.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);


    }



    async componentDidMount() {
        await this.getAllRough();
        this.initialModelOpen();
    }

    initialModelOpen() {
        const { match: { params } } = this.props;
        const { code } = params;

        this.setState({ code });
        console.log('code', code);

        if (code) {
            console.log('roughId1', code);
            const lowerCaseRoughId = code.toLowerCase();

            this.state.tableData.forEach(item => {
                console.log('item.CODE', item.CODE);
                if (item.CODE.toLowerCase() === lowerCaseRoughId) {
                    this.handleUpdateShow(item);
                }
            });
        }
    }

    handlePrint = async (row) => {
        console.log('row', row);
        try {
            const response = await axios.post('http://35.154.1.99:3001/generateQR', {
                data: row
            });

            if (response.data.success) {
                const blob = new Blob([new Uint8Array(atob(response.data.data).split('').map(char => char.charCodeAt(0)))], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                // Removed the line that sets the 'download' attribute
                link.target = '_blank'; // This line makes it open in a new tab
                link.click();
            } else {
                console.error('Error generating QR:', response.data.message);
                // Handle error, e.g., display an error message
            }
        } catch (error) {
            console.error('Error generating QR:', error.message);
            // Handle error, e.g., display an error message
        }
    };

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
            const response = await axios.post('http://35.154.1.99:3001/searchRough', searchData);


            if (response.data.success) {
                const filteredItems = response.data.result;

                // Categorize filtered items based on CP_TYPE
                const categorizedTables = {
                    BlueSapphireNatural: [],
                    BlueSapphireGeuda: [],
                    YellowSapphire: [],
                    PinkSapphireNatural: [],
                    PurpleSapphireNatural: [],
                    VioletSapphire: [],
                    PadparadschaSapphire: [],
                    Mix: [],
                    Fancy: [],
                };

                filteredItems.forEach(item => {
                    const { ROUGH_TYPE } = item;
                    switch (ROUGH_TYPE) {
                        case 'Blue Sapphire Natural':
                            categorizedTables.BlueSapphireNatural.push(item);
                            break;
                        case 'Blue Sapphire Geuda':
                            categorizedTables.BlueSapphireGeuda.push(item);
                            break;
                        case 'Yellow Sapphire':
                            categorizedTables.YellowSapphire.push(item);
                            break;
                        case 'Pink Sapphire Natural':
                            categorizedTables.PinkSapphireNatural.push(item);
                            break;
                        case 'Purple Sapphire Natural':
                            categorizedTables.PurpleSapphireNatural.push(item);
                            break;
                        case 'Violet Sapphire':
                            categorizedTables.VioletSapphire.push(item);
                            break;
                        case 'Padparadscha Sapphire':
                            categorizedTables.PadparadschaSapphire.push(item);
                            break;
                        case 'Mix':
                            categorizedTables.Mix.push(item);
                            break;
                        case 'Fancy':
                            categorizedTables.Fancy.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableDataBlueSapphireNatural: categorizedTables.BlueSapphireNatural,
                    tableDataBlueSapphireGeuda: categorizedTables.BlueSapphireGeuda,
                    tableDataYellowSapphire: categorizedTables.YellowSapphire,
                    tablePinkSapphireNatural: categorizedTables.PinkSapphireNatural,
                    tablePurpleSapphireNatural: categorizedTables.PurpleSapphireNatural,
                    tableVioletSapphire: categorizedTables.VioletSapphire,
                    tablePadparadschaSapphire: categorizedTables.PadparadschaSapphire,
                    tableMix: categorizedTables.Mix,
                    tableFancy: categorizedTables.Fancy,
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
            const response = await axios.post('http://35.154.1.99:3001/searchRough', searchData);


            if (response.data.success) {
                const filteredItems = response.data.result;
                console.log('filteredItems', filteredItems);

                message.info(response.data.message);
                this.formRef.current.resetFields();

                // Categorize filtered items based on ROUGH_TYPE
                const categorizedTables = {
                    BlueSapphireNatural: [],
                    BlueSapphireGeuda: [],
                    YellowSapphire: [],
                    PinkSapphireNatural: [],
                    PurpleSapphireNatural: [],
                    VioletSapphire: [],
                    PadparadschaSapphire: [],
                    Mix: [],
                    Fancy: [],
                };

                filteredItems.forEach(item => {
                    const { ROUGH_TYPE } = item;
                    switch (ROUGH_TYPE) {
                        case 'Blue Sapphire Natural':
                            categorizedTables.BlueSapphireNatural.push(item);
                            break;
                        case 'Blue Sapphire Geuda':
                            categorizedTables.BlueSapphireGeuda.push(item);
                            break;
                        case 'Yellow Sapphire':
                            categorizedTables.YellowSapphire.push(item);
                            break;
                        case 'Pink Sapphire Natural':
                            categorizedTables.PinkSapphireNatural.push(item);
                            break;
                        case 'Purple Sapphire Natural':
                            categorizedTables.PurpleSapphireNatural.push(item);
                            break;
                        case 'Violet Sapphire':
                            categorizedTables.VioletSapphire.push(item);
                            break;
                        case 'Padparadscha Sapphire':
                            categorizedTables.PadparadschaSapphire.push(item);
                            break;
                        case 'Mix':
                            categorizedTables.Mix.push(item);
                            break;
                        case 'Fancy':
                            categorizedTables.Fancy.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableDataBlueSapphireNatural: categorizedTables.BlueSapphireNatural,
                    tableDataBlueSapphireGeuda: categorizedTables.BlueSapphireGeuda,
                    tableDataYellowSapphire: categorizedTables.YellowSapphire,
                    tablePinkSapphireNatural: categorizedTables.PinkSapphireNatural,
                    tablePurpleSapphireNatural: categorizedTables.PurpleSapphireNatural,
                    tableVioletSapphire: categorizedTables.VioletSapphire,
                    tablePadparadschaSapphire: categorizedTables.PadparadschaSapphire,
                    tableMix: categorizedTables.Mix,
                    tableFancy: categorizedTables.Fancy,
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
            const response = await axios.post('http://35.154.1.99:3001/deactivateItem', {
                ITEM_ID_AI: id,
            });

            if (response.data.success) {
                message.success('Item deleted successfully');
                // Refresh the table
                this.getAllRough();
            } else {
                message.error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            message.error('Internal server error');
        }
    };


    async getAllRough() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getAllRough');

            if (response.data.success) {
                const items = response.data.result;
                console.log('items', items);

                this.setState({
                    tableData: items,
                });

                // Categorize items based on ROUGH_TYPE
                const categorizedTables = {
                    BlueSapphireNatural: [],
                    BlueSapphireGeuda: [],
                    YellowSapphire: [],
                    PinkSapphireNatural: [],
                    PurpleSapphireNatural: [],
                    VioletSapphire: [],
                    PadparadschaSapphire: [],
                    Mix: [],
                    Fancy: [],
                };

                items.forEach(item => {
                    const { ROUGH_TYPE } = item;
                    switch (ROUGH_TYPE) {
                        case 'Blue Sapphire Natural':
                            categorizedTables.BlueSapphireNatural.push(item);
                            break;
                        case 'Blue Sapphire Geuda':
                            categorizedTables.BlueSapphireGeuda.push(item);
                            break;
                        case 'Yellow Sapphire':
                            categorizedTables.YellowSapphire.push(item);
                            break;
                        case 'Pink Sapphire Natural':
                            categorizedTables.PinkSapphireNatural.push(item);
                            break;
                        case 'Purple Sapphire Natural':
                            categorizedTables.PurpleSapphireNatural.push(item);
                            break;
                        case 'Violet Sapphire':
                            categorizedTables.VioletSapphire.push(item);
                            break;
                        case 'Padparadscha Sapphire':
                            categorizedTables.PadparadschaSapphire.push(item);
                            break;
                        case 'Mix':
                            categorizedTables.Mix.push(item);
                            break;
                        case 'Fancy':
                            categorizedTables.Fancy.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableDataBlueSapphireNatural: categorizedTables.BlueSapphireNatural,
                    tableDataBlueSapphireGeuda: categorizedTables.BlueSapphireGeuda,
                    tableDataYellowSapphire: categorizedTables.YellowSapphire,
                    tablePinkSapphireNatural: categorizedTables.PinkSapphireNatural,
                    tablePurpleSapphireNatural: categorizedTables.PurpleSapphireNatural,
                    tableVioletSapphire: categorizedTables.VioletSapphire,
                    tablePadparadschaSapphire: categorizedTables.PadparadschaSapphire,
                    tableMix: categorizedTables.Mix,
                    tableFancy: categorizedTables.Fancy,
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
        this.getAllRough();

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
                        <Row gutter={[16, 16]} justify="left" align="top">
                            <Col xs={24} sm={24} md={24} lg={6}>
                                <Form.Item name="searchCode">
                                    <Input
                                        placeholder="Search by Code"
                                        onChange={(e) => this.setState({ searchCode: e.target.value })}
                                        style={{ width: '100%'}}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6}>
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
                            <Col xs={24} sm={24} md={24} lg={6}>
                                <Form.Item name="searchItemId">
                                    <InputNumber
                                        placeholder="Filter by Item ID"
                                        onChange={(value) => this.setState({ searchItemId: value })}
                                        style={{ width: '100%'}}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6}>
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
                    {this.state.tableDataBlueSapphireNatural.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <RoughTableCard
                                title="Blue Sapphire - Natural"
                                backgroundColor="#579BFC"
                                dataSource={this.state.tableDataBlueSapphireNatural}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tableDataBlueSapphireGeuda.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <RoughTableCard
                                title="Blue Sapphire - Geuda"
                                backgroundColor="#61C4F5"
                                dataSource={this.state.tableDataBlueSapphireGeuda}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tableDataYellowSapphire.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <RoughTableCard
                                title="Yellow Sapphire"
                                backgroundColor="#ECA03C"
                                dataSource={this.state.tableDataYellowSapphire}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tablePinkSapphireNatural.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <RoughTableCard
                                title="Pink Sapphire - Natural"
                                backgroundColor="#FF158A"
                                dataSource={this.state.tablePinkSapphireNatural}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tablePurpleSapphireNatural.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <RoughTableCard
                                title="Purple Sapphire - Natural"
                                backgroundColor="#9959D3"
                                dataSource={this.state.tablePurpleSapphireNatural}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tableVioletSapphire.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <RoughTableCard
                                title="Violet Sapphire"
                                backgroundColor="#C7B340"
                                dataSource={this.state.tableVioletSapphire}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tablePadparadschaSapphire.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <RoughTableCard
                                title="Padparadscha Sapphire"
                                backgroundColor="#D04059"
                                dataSource={this.state.tablePadparadschaSapphire}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tableMix.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <RoughTableCard
                                title="Mix"
                                backgroundColor="#7449CB"
                                dataSource={this.state.tableMix}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tableFancy.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <RoughTableCard
                                title="Fancy"
                                backgroundColor="#F9632E"
                                dataSource={this.state.tableFancy}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
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
                            onUpdate={this.getAllRough}
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

export default Rough;
