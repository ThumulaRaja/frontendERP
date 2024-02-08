// /* eslint-disable */
import React, { useEffect, useState } from 'react';
import {Card, Col, InputNumber, Row, Table, Typography} from 'antd';
import axios from 'axios';
import LineChart from '../components/chart/LineChart';
import Paragraph from "antd/lib/typography/Paragraph";
import { RightCircleOutlined} from "@ant-design/icons";
import Cookies from "js-cookie";
import {NavLink} from "react-router-dom";

const { Title } = Typography;

function Home() {
  const [loading, setLoading] = useState(false);
  const [countData, setCountData] = useState([]);
  const [todayTransactionData, setTodayTransactionData] = useState([]);

  useEffect(() => {
    fetchData();
    fetchTodayTransactionData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axios.post('http://35.154.1.99:3001/getItemCountData');

      if (response.data.success) {
        //console.log('ResponseDashboard:', response.data.result);
        setCountData(response.data.result);
      } else {
        //console.log('Error:', response.data.message);
      }
    } catch (error) {
      //console.log('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayTransactionData = async () => {
    setLoading(true);

    try {
      const response = await axios.post('http://35.154.1.99:3001/getTodayTransactionData');
      if (response.data.success) {
        //console.log('ResponseDashboard1:', response.data.result);
        setTodayTransactionData(response.data.result);
      } else {
        //console.log('Error:', response.data.message);
      }
    } catch (error) {
      //console.log('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  let rememberedUser = Cookies.get('rememberedUser');

  let NAME1 = "NO User";
    let ROLE1 = "USER";

  if (rememberedUser) {
    rememberedUser = JSON.parse(rememberedUser);
    const { USER_ID, NAME,ROLE } = rememberedUser;
    NAME1 = NAME;
    ROLE1 = ROLE;
    //console.log(`User ID: ${USER_ID}, Name: ${NAME}`);
  }
  else{
    Cookies.remove('rememberedUser');
    window.location.href = '/';
  }

  const renderCountCards = () => {
    if (!countData) return null;

    return (
        <>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="circlebox">
              <div className="number">
                <Row gutter={[24, 0]}>

                  {/* Rough Section */}
                  {countData.roughCounts && (
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Card
                            bordered
                            className="circlebox-subcard"
                            style={{
                              width: '100%',
                              height: 'auto', // Set 'auto' for mobile view
                              marginBottom: '16px',
                              background: 'linear-gradient(to right, #003BACFF, #5D91FFFF)',
                              padding: '16px',
                              flexDirection: 'column',
                              justifyContent: 'left',
                              alignItems: 'center',
                            }}
                        >
                          {(() => {
                            let total = 0;
                            for (let i = 0; i < countData.roughCounts.length; i++) {
                              total += countData.roughCounts[i].COUNT;
                            }
                            return <Title level={3} style={{ color: '#fff' }}> Total Roughs 🪨 - {total} </Title>;
                          })()}
                          <NavLink to="/rough">
                            <Paragraph style={{ color: '#dfeafb' }}>
                              More Details <RightCircleOutlined style={{ color: '#dfeafb' }} />
                            </Paragraph>
                          </NavLink>
                          <div className="chart-visitor-count">
                            {countData.roughCounts.map((v, index) => (
                                <div key={index}>
                                  <Title level={4} style={{ color: '#fff' }}>{v.ROUGH_TYPE} - {v.COUNT}</Title>
                                </div>
                            ))}
                          </div>
                        </Card>
                      </Col>
                  )}

                  {/* Lots Section */}
                  {countData.lotsCounts && (
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Card
                            bordered
                            className="circlebox-subcard"
                            style={{
                              width: '100%',
                              height: 'auto', // Set 'auto' for mobile view
                              marginBottom: '16px',
                              background: 'linear-gradient(to right, #2A7200FF, #5E9D41FF)',
                              padding: '16px',
                              flexDirection: 'column',
                              justifyContent: 'left',
                              alignItems: 'center',
                            }}
                        >
                          {(() => {
                            let total = 0;
                            for (let i = 0; i < countData.lotsCounts.length; i++) {
                              total += countData.lotsCounts[i].COUNT;
                            }
                            return <Title level={3} style={{ color: '#fff' }}> Total Lots 📦 - {total} </Title>;
                          })()}
                          <NavLink to="/lots">
                            <Paragraph style={{ color: '#dfeafb' }}>
                              More Details <RightCircleOutlined style={{ color: '#dfeafb' }} />
                            </Paragraph>
                          </NavLink>
                          <div className="chart-visitor-count">
                            {countData.lotsCounts.map((v, index) => (
                                <div key={index}>
                                  <Title level={4} style={{ color: '#fff' }}>{v.LOT_TYPE} - {v.COUNT}</Title>
                                </div>
                            ))}
                          </div>
                        </Card>
                      </Col>
                  )}

                  {/* Sorted Lots Section */}
                  {countData.sortedLotsCounts && (
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Card
                            bordered
                            className="circlebox-subcard"
                            style={{
                              width: '100%',
                              height: 'auto', // Set 'auto' for mobile view
                              marginBottom: '16px',
                              background: 'linear-gradient(to right, #2F294FFF, #534E6BFF)',
                              padding: '16px',
                              flexDirection: 'column',
                              justifyContent: 'left',
                              alignItems: 'center',
                            }}
                        >
                          {(() => {
                            let total = 0;
                            for (let i = 0; i < countData.sortedLotsCounts.length; i++) {
                              total += countData.sortedLotsCounts[i].COUNT;
                            }
                            return <Title level={3} style={{ color: '#fff' }}> Total Sorted Lots 📦 - {total} </Title>;
                          })()}
                          <NavLink to="/sorted-lots">
                            <Paragraph style={{ color: '#dfeafb' }}>
                              More Details <RightCircleOutlined style={{ color: '#dfeafb' }} />
                            </Paragraph>
                          </NavLink>
                          <div className="chart-visitor-count">
                            {countData.sortedLotsCounts.map((v, index) => (
                                <div key={index}>
                                  <Title level={4} style={{ color: '#fff' }}>{v.SORTED_LOT_TYPE} - {v.COUNT}</Title>
                                </div>
                            ))}
                          </div>
                        </Card>
                      </Col>
                  )}

                  {/* Cut and Polished Section */}
                  {countData.cutAndPolishedCounts && (
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Card
                            bordered
                            className="circlebox-subcard"
                            style={{
                              width: '100%',
                              height: 'auto', // Set 'auto' for mobile view
                              marginBottom: '16px',
                              background: 'linear-gradient(to right, #A81313FF, #A81313CB)',
                              padding: '16px',
                              flexDirection: 'column',
                              justifyContent: 'left',
                              alignItems: 'center',
                            }}
                        >
                          {(() => {
                            let total = 0;
                            for (let i = 0; i < countData.cutAndPolishedCounts.length; i++) {
                              total += countData.cutAndPolishedCounts[i].COUNT;
                            }
                            return <Title level={3} style={{ color: '#fff' }}> Total Cut and Polished 💎 - {total} </Title>;
                          })()}
                          <NavLink to="/c-p">
                            <Paragraph style={{ color: '#dfeafb' }}>
                              More Details <RightCircleOutlined style={{ color: '#dfeafb' }} />
                            </Paragraph>
                          </NavLink>
                          <div className="chart-visitor-count">
                            {countData.cutAndPolishedCounts.map((v, index) => (
                                <div key={index}>
                                  <Title level={4} style={{ color: '#fff' }}>{v.CP_TYPE} - {v.COUNT}</Title>
                                </div>
                            ))}
                          </div>
                        </Card>
                      </Col>
                  )}
                </Row>
              </div>
            </Card>
          </Col>
        </>
    );
  };


  return (
      <>
        <div className="layout-header">
          <Title level={3} style={{ marginBottom: 20 }}>Welcome to Nihal Gems Management System, {NAME1}! 👋</Title>
        </div>

        <div className="layout-content">
          {ROLE1 === "ADMIN" ? (
          <Row gutter={[16, 16]} justify="left" align="top">
            <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <LineChart />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
              <Card bordered={false} className="criclebox h-full"
                    title={'Today\'s Transactions'}>
                <div className="table-responsive">
                  <Table
                      className="ant-border-space"
                      size="small"
                      style={{ margin: '15px' }}
                      rowKey="TRANSACTION_ID"
                      columns={[
                        {
                          title: 'Transaction Code',
                          dataIndex: 'CODE',
                          render: (text, record) => {
                            return (
                                <div style={{
                                  fontWeight: 'bold',
                                  color: (record.TYPE === 'Selling' || record.TYPE === 'S Payment') ? 'green' :
                                      (record.TYPE === 'Buying' || record.TYPE === 'B Payment') ? 'red' : 'inherit'
                                }}>
                                  {text}
                                </div>
                            );
                          }
                        },
                        {
                          title: 'Reference Item',
                          dataIndex: 'ITEM_CODE',
                        },
                        {
                          title: 'Customer Name',
                          dataIndex: 'C_NAME',
                        },
                        {
                          title: 'Payment',
                          dataIndex: 'PAYMENT_AMOUNT',
                          render: (text, record) => {
                            return (
                                <InputNumber
                                    readOnly
                                    defaultValue={text}
                                    formatter={(value) =>
                                        `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    parser={(value) => value.replace(/\Rs.\s?|(,*)/g, '')}
                                />
                            );
                          },
                        },
                      ]}
                      dataSource={todayTransactionData}
                      pagination={{
                        pageSize: 5
                      }}
                      loading={loading}
                  />

                </div>
              </Card>
            </Col>
          </Row>
          ) : null}
          <Row className="rowgap-vbox" gutter={[24, 0]}>
            {renderCountCards()}
          </Row>
        </div>

      </>
  );
}

export default Home;
