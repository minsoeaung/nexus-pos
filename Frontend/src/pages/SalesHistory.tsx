import Title from 'antd/es/typography/Title';
import {Button, Card, Descriptions, DescriptionsProps, Modal, Table, TableProps, Tag, Typography} from 'antd';
import {useQuery} from 'react-query';
import {ApiClient} from '../api/apiClient.ts';
import {Receipt} from '../types/ReceiptDto.ts';
import {RedoOutlined} from '@ant-design/icons';
import {USDollar} from './Products.tsx';
import {useState} from "react";

const {Text} = Typography;

const SalesHistory = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const {data, isLoading, isFetching, refetch} = useQuery({
    queryKey: ['receipts'],
    queryFn: async () => await ApiClient.get<never, Receipt[]>('api/Receipts'),
  });

  const columns: TableProps<Receipt>['columns'] = [
    {
      title: 'Order Id',
      key: 'Id',
      // width: '10%',
      render: (_, record) => <p>{record.id}</p>,
    },
    {
      title: 'Customer Name',
      key: 'Customer',
      // width: '25%',
      render: (_, record) => <p>{record.customer?.name}</p>,
    },
    {
      title: 'Customer Phone Number',
      key: 'Customer',
      // width: '25%',
      render: (_, record) => <p>{record.customer?.phoneNumber}</p>,
    },
    {
      title: 'Total Amount',
      key: 'Customer',
      // width: '20%',
      render: (_, record) => (
        <p style={{color: 'green'}}>
          {USDollar.format(record.receiptItems.reduce((previousValue, product) => previousValue + (product.quantity * product.price), 0))}
        </p>
      ),
    },
    {
      title: 'Time',
      key: 'createdAt',
      // width: '40%',
      render: (_, record) => <p>{new Date(record.createdAt).toLocaleTimeString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
      })}</p>,
    },
    {
      title: "Conducted By",
      key: "ConductedBy",
      render: (_, record) => {
        if (!record.appUser) return "-";
        return (
          <Tag color="blue">{record.appUser.userName}</Tag>
        )
      }
    },
    {
      title: 'Action',
      key: 'Action',
      // width: '25%',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => setSelectedReceipt(record)}
        >
          See order details
        </Button>
      ),
    },
  ];

  return (
    <section>
      <Title level={3}>Sales History</Title>
      <br/>
      <Modal open={Boolean(selectedReceipt)} onCancel={() => setSelectedReceipt(null)} footer={false}>
        {selectedReceipt && (
          <OrderDetails receipt={selectedReceipt}/>
        )}
      </Modal>
      <Card
        extra={
          <Button
            icon={<RedoOutlined/>}
            onClick={() => refetch()}
          />
        }
      >
        <Table
          bordered
          size="small"
          loading={isLoading || isFetching}
          columns={columns}
          rowKey={record => record.id}
          dataSource={data ? data : []}
          pagination={{
            size: 'default',
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>
    </section>
  );
};

const OrderDetails = ({receipt}: { receipt: Receipt }) => {
  if (!receipt) return null;

  const items: DescriptionsProps['items'] = [
    {
      key: 'Customer',
      label: 'Customer',
      children: (
        <>
          {receipt.customer?.name || ''}
          <br/>
          {receipt.customer?.phoneNumber || ''}
          <br/>
          {receipt.customer?.address || ''}
        </>
      ),
    },
    {
      key: 'Total Amount',
      label: 'Total Amount',
      children: (
        <span style={{color: 'green'}}>
          {USDollar.format(receipt.receiptItems.reduce((previousValue, product) => previousValue + (product.quantity * product.price), 0))}
        </span>
      ),
    },
    {
      key: 'Time',
      label: 'Time',
      children: (
        new Date(receipt.createdAt).toLocaleTimeString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
        })
      ),
    },
    {
      key: 'Products',
      label: 'Products',
      children: (
        <div>
          {receipt.receiptItems.map(receiptItem => (
            <div key={receiptItem.id}>
              {receiptItem.item ? receiptItem.item.name : <Text type="danger">Deleted
                product</Text>} - {`${receiptItem.quantity}x (${USDollar.format(receiptItem.price)} each)`}
              <br/>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Descriptions bordered title="Order Details" items={items} column={1}/>
  );
};

export default SalesHistory;