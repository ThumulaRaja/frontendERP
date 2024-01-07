import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography } from 'antd';
import axios from 'axios';
import EChart from '../components/chart/EChart';
import LineChart from '../components/chart/LineChart';
import Paragraph from "antd/lib/typography/Paragraph";
import {RightCircleOutlined} from "@ant-design/icons";
import Cookies from "js-cookie";
import {NavLink} from "react-router-dom";

const { Title } = Typography;

function Home() {
  const [loading, setLoading] = useState(false);
  const [countData, setCountData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/getItemCountData');

      if (response.data.success) {
        console.log('ResponseDashboard:', response.data.result);
        setCountData(response.data.result);
      } else {
        console.log('Error:', response.data.message);
      }
    } catch (error) {
      console.log('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  let rememberedUser = Cookies.get('rememberedUser');

  let NAME1 = "NO User";

  if (rememberedUser) {
    rememberedUser = JSON.parse(rememberedUser);
    const { USER_ID, NAME } = rememberedUser;
    NAME1 = NAME;
    console.log(`User ID: ${USER_ID}, Name: ${NAME}`);
  }
  else{
    Cookies.remove('rememberedUser');
    window.location.href = '/';
  }

  const renderCountCards = () => {
    if (!countData) return null;

    return (
        <>
          <Card bordered={false} className="circlebox">
          {countData.roughCounts && (
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                <Card bordered={false} className="circlebox">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={8}>
                        <Card
                            bordered
                            className="circlebox-subcard"
                            style={{
                              width: '100%',
                              height: '250px',
                              marginBottom: '16px',
                              background: 'linear-gradient(to right, #003BACFF, #5D91FFFF)',
                              padding: '16px',
                              flexDirection: 'column',
                              justifyContent: 'left',
                              alignItems: 'center',
                            }}
                        >
                          <div className="chart-visitor-count">
                          <Title level={3} style={{ color: '#fff' }}> Total Roughs 🪨 </Title>
                          {(() => {
                            let total = 0;
                            for (let i = 0; i < countData.roughCounts.length; i++) {
                              total += countData.roughCounts[i].COUNT;
                            }
                            return <span style={{ fontSize: '24px', color: '#ffffff' }}>In Inventory - {total}</span>;
                          })()}
                            <NavLink to="/rough">
                            <Paragraph style={{ color: '#dfeafb' }}>
                              More Details <RightCircleOutlined style={{ color: '#dfeafb' }} />
                            </Paragraph>
                            </NavLink>
                            </div>
                        </Card>
                      </Col>
                      <Col xs={16}>
                        <Row align="middle" gutter={[24, 0]}>
                          {countData.roughCounts.map((v, index) => (
                              <Col xs={6} key={index}>
                                <Card
                                    bordered
                                    className="circlebox-subcard"
                                    style={{
                                      width: '100%',
                                      height: '120px',
                                      marginBottom: '16px',
                                      background: 'linear-gradient(to right, #bbd4fc, #D9DCF8FF)',
                                      display: 'flex',
                                      // flexDirection: 'column',
                                      justifyContent: 'left',
                                      alignItems: 'top',
                                      //borderColor: '#a9a9a9',
                                    }}
                                >
                                  <div className="chart-visitor-count">
                                    <Title level={4}>{v.COUNT}</Title>
                                    <span>{v.ROUGH_TYPE}</span>

                                  </div>
                                </Card>
                              </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
          )}

          {countData.lotsCounts && (
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                <Card bordered={false} className="circlebox">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={8}>
                        <Card
                            bordered
                            className="circlebox-subcard"
                            style={{
                              width: '100%',
                              height: '250px',
                              marginBottom: '16px',
                              background: 'linear-gradient(to right, #2A7200FF, #5E9D41FF)',
                              padding: '16px',
                              flexDirection: 'column',
                              justifyContent: 'left',
                              alignItems: 'center',
                            }}
                        >
                          <Title level={3} style={{ color: '#fff' }}> Total Lots </Title>
                          {(() => {
                            let total = 0;
                            for (let i = 0; i < countData.lotsCounts.length; i++) {
                              total += countData.lotsCounts[i].COUNT;
                            }
                            return <span style={{ fontSize: '24px', color: '#ffffff' }}>In Inventory - {total}</span>;
                          })()}
                          <NavLink to="/lots">
                          <Paragraph style={{ color: '#dfeafb' }}>More Details <RightCircleOutlined style={{ color: '#dfeafb' }} /></Paragraph>
                            </NavLink>
                        </Card>
                      </Col>
                      <Col xs={16}>
                        <Row align="middle" gutter={[24, 0]}>
                          {countData.lotsCounts.map((v, index) => (
                              <Col xs={6} key={index}>
                                <Card
                                    bordered
                                    className="circlebox-subcard"
                                    style={{
                                      width: '100%',
                                      height: '120px',
                                      marginBottom: '16px',
                                      background: 'linear-gradient(to right, #c1ffac, #DAFFACFF)',
                                      display: 'flex',
                                      // flexDirection: 'column',
                                      justifyContent: 'left',
                                      alignItems: 'top',
                                      //borderColor: '#a9a9a9',
                                    }}
                                >
                                  <div className="chart-visitor-count">
                                    <Title level={4}>{v.COUNT}</Title>
                                    <span>{v.LOT_TYPE}</span>

                                  </div>
                                </Card>
                              </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
          )}

          {countData.sortedLotsCounts && (
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                <Card bordered={false} className="circlebox">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={8}>
                        <Card
                            bordered
                            className="circlebox-subcard"
                            style={{
                              width: '100%',
                              height: '250px',
                              marginBottom: '16px',
                              background: 'linear-gradient(to right, #2F294FFF, #534E6BFF)',
                              padding: '16px',
                              flexDirection: 'column',
                              justifyContent: 'left',
                              alignItems: 'center',
                            }}
                        >
                          <Title level={3} style={{ color: '#fff' }}> Total Sorted Lots </Title>
                          {(() => {
                            let total = 0;
                            for (let i = 0; i < countData.sortedLotsCounts.length; i++) {
                              total += countData.sortedLotsCounts[i].COUNT;
                            }
                            return <span style={{ fontSize: '24px', color: '#ffffff' }}>In Inventory - {total}</span>;
                          })()}
                          <NavLink to="/sorted-lots">
                          <Paragraph style={{ color: '#dfeafb' }}>More Details <RightCircleOutlined style={{ color: '#dfeafb' }} /></Paragraph>
                            </NavLink>
                        </Card>
                      </Col>
                      <Col xs={16}>
                        <Row align="middle" gutter={[24, 0]}>
                          {countData.sortedLotsCounts.map((v, index) => (
                              <Col xs={6} key={index}>
                                <Card
                                    bordered
                                    className="circlebox-subcard"
                                    style={{
                                      width: '100%',
                                      height: '120px',
                                      marginBottom: '16px',
                                      background: 'linear-gradient(to right, #cdc8fc, #E9C8FCFF)',
                                      display: 'flex',
                                      justifyContent: 'left',
                                      alignItems: 'top',
                                    }}
                                >
                                  <div className="chart-visitor-count">
                                    <Title level={4}>{v.COUNT}</Title>
                                    <span>{v.SORTED_LOT_TYPE}</span>

                                  </div>
                                </Card>
                              </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
          )}

          {countData.cutAndPolishedCounts && (
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                <Card bordered={false} className="circlebox">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={8}>
                        <Card
                            bordered
                            className="circlebox-subcard"
                            style={{
                              width: '100%',
                              height: '270px',
                              marginBottom: '16px',
                              background: 'linear-gradient(to right, #A81313FF, #A81313CB)',
                              padding: '16px',
                              flexDirection: 'column',
                              justifyContent: 'left',
                              alignItems: 'center',
                            }}
                        >
                          <Title level={3} style={{ color: '#fff' }}> Total Cut and Polished 💎</Title>
                          {(() => {
                            let total = 0;
                            for (let i = 0; i < countData.cutAndPolishedCounts.length; i++) {
                              total += countData.cutAndPolishedCounts[i].COUNT;
                            }
                            return <span style={{ fontSize: '24px', color: '#ffffff' }}>In Inventory - {total}</span>;
                          })()}
                          <NavLink to="/c-p">
                          <Paragraph style={{ color: '#dfeafb' }}>More Details <RightCircleOutlined style={{ color: '#dfeafb' }} /></Paragraph>
                            </NavLink>
                        </Card>
                      </Col>
                      <Col xs={16}>
                        <Row align="middle" gutter={[24, 0]}>
                          {countData.cutAndPolishedCounts.map((v, index) => (
                              <Col xs={6} key={index}>
                                <Card
                                    bordered
                                    className="circlebox-subcard"
                                    style={{
                                      width: '100%',
                                      height: '120px',
                                      marginBottom: '16px',
                                      background: 'linear-gradient(to right, #fcc8c8, #FCDCC8FF)',
                                      display: 'flex',
                                      // flexDirection: 'column',
                                      justifyContent: 'left',
                                      alignItems: 'top',
                                      //borderColor: '#a9a9a9',
                                    }}
                                >
                                  <div className="chart-visitor-count">
                                    <Title level={4}>{v.COUNT}</Title>
                                    <span>{v.CP_TYPE}</span>

                                  </div>
                                </Card>
                              </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
          )}
            </Card>

        </>
    );
  };


  return (
      <>
        <div className="layout-header">
          <Title level={3} style={{ marginBottom: 20 }}>Welcome to Nihal Gems ERP System, {NAME1}! 👋</Title>
        </div>
        <div className="layout-content">
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <EChart />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <LineChart />
              </Card>
            </Col>
          </Row>
          <Row className="rowgap-vbox" gutter={[24, 0]}>
            {renderCountCards()}
          </Row>
        </div>
      </>
  );
}

export default Home;
