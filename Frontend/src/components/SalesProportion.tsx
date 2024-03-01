import { Pie } from '@ant-design/charts';
import { Card, Radio, Spin } from 'antd';
import { useQuery } from 'react-query';
import { ApiClient } from '../api/apiClient.ts';
import { Proportion } from '../types/Proportion.ts';
import { memo, useState } from 'react';

export const SalesProportion = memo(() => {
  const [type, setType] = useState<'category' | 'vendor'>('category');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['sales-category-proportion', type],
    queryFn: async () => await ApiClient.get<never, Proportion[]>(`api/Dashboard/sales-proportion?type=${type}`),
  });

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      text: (d: { type: string, value: number }) => `${d.type}`,
      position: 'spider',
    },
    legend: {
      color: {
        position: 'left',
      },
    },
  };

  return (
    <Card
      title="Sales Proportion"
      bordered={false}
      extra={
        <Radio.Group defaultValue="category" onChange={(e) => setType(e.target.value)}>
          <Radio.Button value="category">Category</Radio.Button>
          <Radio.Button value="vendor">Vendor</Radio.Button>
        </Radio.Group>
      }
    >
      <Spin spinning={isLoading || isFetching}>
        <Pie {...config} />
      </Spin>
    </Card>
  );
});