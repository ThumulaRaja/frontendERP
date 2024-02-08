// /* eslint-disable */
import React, { Component } from 'react';
import {
    Button,
    Col,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    Select,
    Form
} from 'antd';
import axios from 'axios';
import CPTableCard from './CPTableCard';
import UpdateItemsForm from "../Items/UpdateItemsForm";
import ViewItemsForm  from "../Items/ViewItemsForm";


const { Option } = Select;

class CP extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            loading: false,
            filteredTableData: [],
            isUpdateModalVisible: false,
            isViewModalVisible: false,
            selectedItem: null,
            tableDataBlueSapphireNatural : [],
            tableDataBlueSapphireHeated : [],
            tableDataYellowSapphire  : [],
            tablePinkSapphireNatural : [],
            tablePinkSapphireTreated : [],
            tablePurpleSapphireNatural : [],
            tableVioletSapphireNaturalNatural : [],
            tableBlueSapphireTreatedLots : [],
            tablePadparadschaSapphireNaturalNatural : [],



            searchCode: '',
            searchStatus: '',
            searchItemId: null,
        };

        // Bind methods
        this.handleUpdateShow = this.handleUpdateShow.bind(this);
        this.handleViewShow = this.handleViewShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getAllCP = this.getAllCP.bind(this);
        this.toggleUpdateModal = this.toggleUpdateModal.bind(this);
        this.toggleViewModal = this.toggleViewModal.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

    }

    async componentDidMount() {
        await this.getAllCP();
        this.initialModelOpen()

    }

    initialModelOpen() {
        const { match: { params } } = this.props;
        const { code } = params;

        this.setState({ code });
        //console.log('code', code);

        if (code) {
            //console.log('roughId1', code);
            const lowerCaseRoughId = code.toLowerCase();

            this.state.tableData.forEach(item => {
                //console.log('item.CODE', item.CODE);
                if (item.CODE.toLowerCase() === lowerCaseRoughId) {
                    this.handleUpdateShow(item);
                }
            });
        }
    }

    handlePrint = async (row) => {
        //console.log('row', row);
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
            const response = await axios.post('http://35.154.1.99:3001/searchCP', searchData);


            if (response.data.success) {
                const filteredItems = response.data.result;
                //console.log('filteredItems', filteredItems);

                message.info(response.data.message);
                this.formRef.current.resetFields();

                // Categorize filtered items based on CP_TYPE
                const categorizedTables = {
                    BlueSapphireNatural: [],
                    BlueSapphireHeated: [],
                    YellowSapphire: [],
                    PinkSapphireNatural: [],
                    PinkSapphireTreated: [],
                    PurpleSapphireNatural: [],
                    VioletSapphireNatural: [],
                    BlueSapphireTreatedLots: [],
                    PadparadschaSapphireNatural: [],
                };

                filteredItems.forEach(item => {
                    const { CP_TYPE } = item;
                    switch (CP_TYPE) {
                        case 'Blue Sapphire Natural':
                            categorizedTables.BlueSapphireNatural.push(item);
                            break;
                        case 'Blue Sapphire Heated':
                            categorizedTables.BlueSapphireHeated.push(item);
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
                        case 'Violet Sapphire Natural':
                            categorizedTables.VioletSapphireNatural.push(item);
                            break;
                        case 'Padparadscha Sapphire Natural':
                            categorizedTables.PadparadschaSapphireNatural.push(item);
                            break;
                        case 'Pink Sapphire Treated':
                            categorizedTables.PinkSapphireTreated.push(item);
                            break;
                        case 'Blue Sapphire Treated Lots':
                            categorizedTables.BlueSapphireTreatedLots.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableDataBlueSapphireNatural: categorizedTables.BlueSapphireNatural,
                    tableDataBlueSapphireHeated: categorizedTables.BlueSapphireHeated,
                    tableDataYellowSapphire: categorizedTables.YellowSapphire,
                    tablePinkSapphireNatural: categorizedTables.PinkSapphireNatural,
                    tablePurpleSapphireNatural: categorizedTables.PurpleSapphireNatural,
                    tableVioletSapphireNaturalNatural: categorizedTables.VioletSapphireNatural,
                    tablePadparadschaSapphireNaturalNatural: categorizedTables.PadparadschaSapphireNatural,
                    tablePinkSapphireTreated: categorizedTables.PinkSapphireTreated,
                    tableBlueSapphireTreatedLots: categorizedTables.BlueSapphireTreatedLots,
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
            const response = await axios.post('http://35.154.1.99:3001/searchCP', searchData);


            if (response.data.success) {
                const filteredItems = response.data.result;

                // Categorize filtered items based on CP_TYPE
                const categorizedTables = {
                    BlueSapphireNatural: [],
                    BlueSapphireHeated: [],
                    YellowSapphire: [],
                    PinkSapphireNatural: [],
                    PinkSapphireTreated: [],
                    PurpleSapphireNatural: [],
                    VioletSapphireNatural: [],
                    BlueSapphireTreatedLots: [],
                    PadparadschaSapphireNatural: [],
                };

                filteredItems.forEach(item => {
                    const { CP_TYPE } = item;
                    switch (CP_TYPE) {
                        case 'Blue Sapphire Natural':
                            categorizedTables.BlueSapphireNatural.push(item);
                            break;
                        case 'Blue Sapphire Heated':
                            categorizedTables.BlueSapphireHeated.push(item);
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
                        case 'Violet Sapphire Natural':
                            categorizedTables.VioletSapphireNatural.push(item);
                            break;
                        case 'Padparadscha Sapphire Natural':
                            categorizedTables.PadparadschaSapphireNatural.push(item);
                            break;
                        case 'Pink Sapphire Treated':
                            categorizedTables.PinkSapphireTreated.push(item);
                            break;
                        case 'Blue Sapphire Treated Lots':
                            categorizedTables.BlueSapphireTreatedLots.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableDataBlueSapphireNatural: categorizedTables.BlueSapphireNatural,
                    tableDataBlueSapphireHeated: categorizedTables.BlueSapphireHeated,
                    tableDataYellowSapphire: categorizedTables.YellowSapphire,
                    tablePinkSapphireNatural: categorizedTables.PinkSapphireNatural,
                    tablePurpleSapphireNatural: categorizedTables.PurpleSapphireNatural,
                    tableVioletSapphireNaturalNatural: categorizedTables.VioletSapphireNatural,
                    tablePadparadschaSapphireNaturalNatural: categorizedTables.PadparadschaSapphireNatural,
                    tablePinkSapphireTreated: categorizedTables.PinkSapphireTreated,
                    tableBlueSapphireTreatedLots: categorizedTables.BlueSapphireTreatedLots,
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
    };


    handleUpdateShow(row) {
        //console.log('row', row);
        this.setState({
            selectedItem: row,
            isUpdateModalVisible: true,
        });
        //console.log('selectedItem', this.state.selectedItem);
    }

    handleViewShow(row) {
        //console.log('row', row);
        this.setState({
            selectedItem: row,
            isViewModalVisible: true,
        });
        //console.log('selectedItem', this.state.selectedItem);
    }


    handleDelete = async (id) => {
        //console.log('id', id);
        try {
            // Make an API call to deactivate the customer
            const response = await axios.post('http://35.154.1.99:3001/deactivateItem', {
                ITEM_ID_AI: id,
            });

            if (response.data.success) {
                message.success('Item deleted successfully');
                // Refresh the table
                this.getAllCP();
            } else {
                message.error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            message.error('Internal server error');
        }
    };


    async getAllCP() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('http://35.154.1.99:3001/getAllCP');

            if (response.data.success) {
                const items = response.data.result;
                //console.log('items', items);

                this.setState({
                    tableData: items,
                });

                // Categorize items based on CP_TYPE
                const categorizedTables = {
                    BlueSapphireNatural: [],
                    BlueSapphireHeated: [],
                    YellowSapphire: [],
                    PinkSapphireNatural: [],
                    PurpleSapphireNatural: [],
                    VioletSapphireNatural: [],
                    PadparadschaSapphireNatural: [],
                    PinkSapphireTreated: [],
                    BlueSapphireTreatedLots: [],
                };

                items.forEach(item => {
                    const { CP_TYPE } = item;
                    switch (CP_TYPE) {
                        case 'Blue Sapphire Natural':
                            categorizedTables.BlueSapphireNatural.push(item);
                            break;
                        case 'Blue Sapphire Heated':
                            categorizedTables.BlueSapphireHeated.push(item);
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
                        case 'Violet Sapphire Natural':
                            categorizedTables.VioletSapphireNatural.push(item);
                            break;
                        case 'Padparadscha Sapphire Natural':
                            categorizedTables.PadparadschaSapphireNatural.push(item);
                            break;
                        case 'Pink Sapphire Treated':
                            categorizedTables.PinkSapphireTreated.push(item);
                            break;
                        case 'Blue Sapphire Treated Lots':
                            categorizedTables.BlueSapphireTreatedLots.push(item);
                            break;
                        default:
                            break;
                    }
                });

                this.setState({
                    tableDataBlueSapphireNatural: categorizedTables.BlueSapphireNatural,
                    tableDataBlueSapphireHeated: categorizedTables.BlueSapphireHeated,
                    tableDataYellowSapphire: categorizedTables.YellowSapphire,
                    tablePinkSapphireNatural: categorizedTables.PinkSapphireNatural,
                    tablePurpleSapphireNatural: categorizedTables.PurpleSapphireNatural,
                    tableVioletSapphireNaturalNatural: categorizedTables.VioletSapphireNatural,
                    tablePadparadschaSapphireNaturalNatural: categorizedTables.PadparadschaSapphireNatural,
                    tablePinkSapphireTreated: categorizedTables.PinkSapphireTreated,
                    tableBlueSapphireTreatedLots: categorizedTables.BlueSapphireTreatedLots,
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
        this.getAllCP();

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
                                        <Option value="With Sales Person">With Sales Person</Option>
                                        <Option value="Cutting">Cutting</Option>
                                        <Option value="Ready for Selling">Ready for Selling</Option>
                                        <Option value="Heat Treatment">Heat Treatment</Option>
                                        <Option value="Electric Treatment">Electric Treatment</Option>
                                        <Option value="C&P">C&P</Option>
                                        <Option value="Preformed">Preformed</Option>
                                        <Option value="Added to a lot">Added to a lot</Option>
<Option value="With Heat T">With Heat T</Option>
<Option value="With C&P">With C&P</Option>
<Option value="With Electric T">With Electric T</Option>
                                <Option value="With Preformer">With Preformer</Option>
                                    </Select>
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
                            <CPTableCard
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
                    {this.state.tableDataBlueSapphireHeated.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <CPTableCard
                                title="Blue Sapphire - Heated"
                                backgroundColor="#0086C0"
                                dataSource={this.state.tableDataBlueSapphireHeated}
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
                            <CPTableCard
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
                            <CPTableCard
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
                    {this.state.tablePinkSapphireTreated.length > 0 && (
                        <Row gutter={[16, 16]} justify="left" align="top">
                            <Col xs="24" xl={24}>
                                <CPTableCard
                                    title="Pink Sapphire - Treated"
                                    backgroundColor="#FF158A"
                                    dataSource={this.state.tablePinkSapphireTreated}
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
                            <CPTableCard
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
                    {this.state.tableVioletSapphireNaturalNatural.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <CPTableCard
                                title="Violet Sapphire - Natural"
                                backgroundColor="#C7B340"
                                dataSource={this.state.tableVioletSapphireNaturalNatural}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}


                    {this.state.tableBlueSapphireTreatedLots.length > 0 && (
                    <Row gutter={[16, 16]} justify="left" align="top">
                        <Col xs="24" xl={24}>
                            <CPTableCard
                                title="Blue Sapphire - Treated Lots"
                                backgroundColor="#66CCFF"
                                dataSource={this.state.tableBlueSapphireTreatedLots}
                                handleUpdateShow={this.handleUpdateShow}
                                handleViewShow={this.handleViewShow}
                                handleDelete={this.handleDelete}
                                handlePrint={this.handlePrint}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    )}
                    {this.state.tablePadparadschaSapphireNaturalNatural.length > 0 && (
                        <Row gutter={[16, 16]} justify="left" align="top">
                            <Col xs="24" xl={24}>
                                <CPTableCard
                                    title="Padparadscha Sapphire - Natural"
                                    backgroundColor="#D04059"
                                    dataSource={this.state.tablePadparadschaSapphireNaturalNatural}
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
                            onUpdate={this.getAllCP}
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

export default CP;
