import { Card, InputNumber, Space, Table, TableProps, Typography } from 'antd';
import { useQuery } from 'react-query';
import { ApiClient } from '../api/apiClient.ts';
import { PagedResponse } from '../types/PagedResponse.ts';
import { Item } from '../types/Item.ts';
import { useRef, useState } from 'react';

const { Text } = Typography;

const columns: TableProps<Item>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name) => name,
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
    align: 'center',
    render: (stock) => <Text>{stock}</Text>,
  },
];

export const LowStockItems = () => {
  const [stockThreshold, setStockThreshold] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const stockThresholdRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', `orderBy=stock&pageNumber=${pageNumber}&stockThreshold=${stockThreshold}`],
    queryFn: async () => await ApiClient.get<never, PagedResponse<Item>>(`api/items?orderBy=stock&pageNumber=${pageNumber}&stockThreshold=${stockThreshold}`),
    keepPreviousData: true,
  });

  const handleTableChange: TableProps<Item>['onChange'] = (pagination) => {
    setPageNumber(Number(pagination.current));
  };

  return (
    <Card
      title="Low Stock Products"
      bordered={false}
      extra={
        <Space>
          Stock threshold:
          <InputNumber
            defaultValue={20}
            ref={stockThresholdRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (stockThresholdRef.current)
                  setStockThreshold(Number(stockThresholdRef.current.value));
              }
            }}
          />
        </Space>
      }
    >
      <Table
        title={() => `Products with stock less than ${stockThreshold}`}
        size="small"
        loading={isLoading || isFetching}
        columns={columns}
        rowKey={record => record.id}
        dataSource={data ? data.results : []}
        onChange={handleTableChange}
        pagination={{
          current: data?.pagination.currentPage || 1,
          pageSize: data?.pagination.pageSize || 10,
          total: data?.pagination.totalCount,
          size: 'default',
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} items`,
        }}
      />
    </Card>
  );
};