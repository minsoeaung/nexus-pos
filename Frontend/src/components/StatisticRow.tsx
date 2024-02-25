import { Card, Col, Statistic } from 'antd';
import { DropboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { ApiClient } from '../api/apiClient.ts';
import { StatisticType } from '../types/StatisticType.ts';

export const StatisticRow = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['statistic'],
    queryFn: async () => await ApiClient.get<never, StatisticType>('api/Dashboard/statistics'),
  });

  return (
    <>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            loading={isLoading}
            title="Today's Sales"
            value={data?.todaySales}
            precision={2}
            valueStyle={{ color: 'green' }}
            prefix="$"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            loading={isLoading}
            title="Annual Sales"
            value={data?.annualSales}
            precision={2}
            valueStyle={{ color: 'green' }}
            prefix="$"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Total Unique Products"
            value={data?.totalUniqueProducts}
            valueStyle={{ color: 'blue' }}
            prefix={<DropboxOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Number of Products Sold"
            value={data?.numberOfProductsSold}
            valueStyle={{ color: 'blue' }}
            prefix={<ShoppingCartOutlined />}
          />
        </Card>
      </Col>
    </>
  );
};