import { Col, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { SalesProportion } from '../components/SalesProportion.tsx';
import { SalesChart } from '../components/SalesChart.tsx';
import { StatisticRow } from '../components/StatisticRow.tsx';
import { LowStockItems } from '../components/LowStockItems.tsx';


export const Dashboard = () => {
  return (
    <section>
      <Title level={3}>Dashboard</Title>
      <Row gutter={[20, 20]}>
        <StatisticRow />
        <Col span={24}>
          <SalesChart />
        </Col>
        <Col span={12}>
          <SalesProportion />
        </Col>
        <Col span={12}>
          <LowStockItems />
        </Col>
      </Row>
    </section>
  );
};