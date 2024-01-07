//eslint-disable
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import {CheckOutlined, MinusOutlined} from "@ant-design/icons";
import lineChart from "./configs/lineChart";
import axios from "axios";
import {useEffect, useState} from "react";

function LineChart() {
  const { Title, Paragraph } = Typography;
    const [loading, setLoading] = useState(false);
    const [transactionData, setTransactionData] = useState([]);


    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/getTransactionData');

            if (response.data.success) {
                console.log('TransactionData:', response.data.result);
                setTransactionData(response.data.result);
            } else {
                console.log('Error:', response.data.message);
            }
        } catch (error) {
            console.log('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };


    const lineChartData = {
        series: [
            {
                name: "Total Sell Amount",
                data: transactionData.sellTransactions,
                offsetY: 0,
            },
            {
                name: "Total Buy Amount",
                data: transactionData.buyTransactions,
                offsetY: 0,
            },
        ],
    }

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Transactions</Title>
          <Paragraph className="lastweek">
              <span className="bnb2"><CheckOutlined /></span> Transactions summary in last year
          </Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined style={{color: "#008ffb"}}/>} Selling</li>
            <li>{<MinusOutlined style={{color: "#00e396"}}/>} Buying</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChartData.series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
