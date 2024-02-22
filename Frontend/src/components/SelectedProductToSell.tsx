import { Button, Popconfirm, Space, Table, TableProps, Typography } from 'antd';
import { USDollar } from '../pages/Products.tsx';
import { OrderItem } from '../types/ReceiptRequest.ts';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

export type SelectedProduct = {
  name: string;
  price: number;
  vendorName: string;
} & OrderItem;

type Props = {
  dataSource: SelectedProduct[]
  updateQuantity: (id: number, newQuantity: number) => void
  removeProduct: (id: number) => void
}

export const SelectedProductToSell = ({ dataSource = [], updateQuantity, removeProduct }: Props) => {
  const columns: TableProps<SelectedProduct>['columns'] = [
    {
      title: 'PRODUCT',
      dataIndex: 'Name',
      key: 'Name',
      width: '70%',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text>{record.name}</Text>
          <Text type="secondary">{record.vendorName}</Text>
        </Space>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>QTY</div>,
      dataIndex: 'Quantity',
      key: 'Stock',
      align: 'right',
      width: '10%',
      render: (_, record) => <Space>
        <Button type="primary" shape="circle" icon={<MinusOutlined />}
                onClick={() => updateQuantity(record.itemId, record.quantity - 1)} disabled={record.quantity === 1} />
        {record.quantity}
        <Button type="primary" shape="circle" icon={<PlusOutlined />}
                onClick={() => updateQuantity(record.itemId, record.quantity + 1)} />
      </Space>,
    },
    {
      title: 'PRICE',
      dataIndex: 'Price',
      key: 'Price',
      align: 'right',
      width: '10%',
      render: (_, record) => <p>{USDollar.format(record.price * record.quantity)}</p>,
    },
    {
      title: '',
      dataIndex: 'Id',
      key: 'Id',
      align: 'right',
      width: '10%',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to remove?"
          onConfirm={() => removeProduct(record.itemId)}
          okText="Remove"
          cancelText="Cancel"
        >
          <Button icon={<DeleteOutlined />} danger type="text">Remove</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      size="small"
      columns={columns}
      rowKey={item => item.itemId}
      pagination={false}
      dataSource={dataSource}
    />
  );
};