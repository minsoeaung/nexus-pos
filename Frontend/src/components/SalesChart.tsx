import {Badge, Card, Col, DatePicker, Row, Space, Spin, Table, TableProps} from 'antd';
import {Column} from '@ant-design/charts';
import {useQuery} from 'react-query';
import {ApiClient} from '../api/apiClient.ts';
import {USDollar} from '../pages/Products.tsx';
import dayjs from 'dayjs';
import {useState} from 'react';
import {MonthAmount, SalesChart as SalesChartType, TopSellingItem} from '../types/SalesChart.ts';

const columns: TableProps<TopSellingItem>['columns'] = [
  {
    title: 'Rank',
    key: 'id',
    align: 'center',
    render: (_, __, index) => [1, 2, 3].includes(index + 1) ? <Badge color="green" count={index + 1}/> : index + 1,
  },
  {
    title: 'Name',
    key: 'name',
    render: (_, record) => record.name || 'Deleted item',
  },
  {
    title: 'Amount Sold',
    key: 'totalAmount',
    render: (_, record) => <span style={{color: 'green'}}>{USDollar.format(record.amountSold)}</span>,
  },
];

export const SalesChart = () => {
  const [tableHeight, setTableHeight] = useState(0);
  const [year, setYear] = useState<number>(new Date().getUTCFullYear());
  const {data: salesChart, isLoading, isFetching} = useQuery({
    queryKey: ['monthly-sales', String(year)],
    queryFn: async () => await ApiClient.get<never, SalesChartType>(`api/Dashboard/monthly-sales?year=${year}`),
  });

  const config = {
    data: salesChart ? salesChart.monthlySales : [],
    xField: 'month',
    yField: 'amount',
    label: {
      text: (d: MonthAmount) => USDollar.format(d.amount),
      textBaseline: 'bottom',
    },
    // shapeField: "column25D",
    maxBarHeight: '30px',
  };

  return (
    <Card
      title="Sales Overview"
      bordered={false}
      extra={
        <Space>
          <b>Year:</b>
          <DatePicker
            size="large"
            allowClear={false}
            onChange={(date) => {
              if (date && typeof date?.year === 'function')
                setYear(date.year());
            }}
            picker="year"
            defaultValue={dayjs()}
            disabledDate={(currentDate) => currentDate && currentDate.valueOf() > Date.now()}
          />
        </Space>
      }
    >
      <Spin spinning={isLoading || isFetching}>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            {tableHeight && (
              <div style={{height: `${tableHeight}px`}}>
                <Column {...config} />
              </div>
            )}
          </Col>
          <Col span={8} ref={node => node && setTableHeight(node.clientHeight)}>
            <Table
              title={() => `Top selling products of year ${salesChart?.forYear || new Date().getUTCFullYear()}`}
              size="small"
              columns={columns}
              rowKey={item => item.itemId}
              dataSource={salesChart?.topSellingItems || []}
              loading={isLoading || isFetching}
              pagination={false}
            />
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};