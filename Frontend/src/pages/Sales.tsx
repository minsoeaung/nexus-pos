import {
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsProps,
  Flex,
  List,
  message,
  Row,
  Select,
  Spin,
  Typography,
} from 'antd';
import { useMutation, useQuery } from 'react-query';
import { ApiClient } from '../api/apiClient.ts';
import { Category, Item as ItemType, Vendor } from '../types/Item.ts';
import { headerHeight } from '../components/AppHeader.tsx';
import { outletPadding } from './RootLayout.tsx';
import { useCallback, useRef, useState } from 'react';
import { SelectedProduct, SelectedProductToSell } from '../components/SelectedProductToSell.tsx';
import { PagedResponse } from '../types/PagedResponse.ts';
import { LabeledValue } from 'antd/es/select';
import { CheckOutlined } from '@ant-design/icons';
import { USDollar } from './Products.tsx';
import { ReceiptRequest } from '../types/ReceiptRequest.ts';
import { ErrorAlert } from '../components/ErrorAlert.tsx';
import { ApiError } from '../types/ApiError.ts';

const { Title, Text } = Typography;

const Sales = () => {
  const [searchCardHeight, setSearchCardHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<LabeledValue[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  const timerRef = useRef(0);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', { selectedCategory, selectedVendor, searchTerm }],
    queryFn: async () => await ApiClient.get<never, PagedResponse<ItemType>>(`api/items?searchTerm=${searchTerm}&categories=${selectedCategory}&vendors=${selectedVendor}`),
    onSuccess: (data) => {
      setOptions(data.results.map(product => ({ value: product.id, label: product.name })));
    },
    keepPreviousData: true,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await ApiClient.get<never, Category[]>('api/categories'),
  });

  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => await ApiClient.get<never, Vendor[]>('api/vendors'),
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (payload: ReceiptRequest) => await ApiClient.post('api/Receipts', payload),
    onSuccess: () => {
      message.success({
        type: 'success',
        content: 'Order has been completed.',
      });
      setSelectedProducts([]);
    },
  });

  const handleSearchTermChange = (value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearchTerm(value);
    }, 700);
  };

  const updateQuantity = useCallback((id: number, newQuantity: number) => {
    const position = selectedProducts.findIndex(p => p.itemId === id);
    const temp = [...selectedProducts];
    temp[position].quantity = newQuantity;
    setSelectedProducts(temp);
  }, [selectedProducts]);

  const removeProduct = useCallback((id: number) => {
    const position = selectedProducts.findIndex(p => p.itemId === id);
    const temp = [...selectedProducts];
    temp.splice(position, 1);
    setSelectedProducts(temp);
  }, [selectedProducts]);

  const handlePlaceOrder = async () => {
    await placeOrderMutation.mutateAsync({
      // TODO: replace this
      customerId: 5,
      name: '',
      address: '',
      phoneNumber: '',
      orderItems: selectedProducts.map(p => ({ itemId: p.itemId, quantity: p.quantity })),
    });
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Tax',
      children: '0%',
    },
    {
      key: '2',
      label: 'Discount',
      children: '0%',
    },
    {
      key: '3',
      label: 'Sub total',
      children: USDollar.format(selectedProducts.reduce((previousValue, product) => previousValue + (product.quantity * product.price), 0)),
    },
    {
      key: '4',
      label: 'Total',
      children: USDollar.format(selectedProducts.reduce((previousValue, product) => previousValue + (product.quantity * product.price), 0)),
    },
  ];

  return (
    <section>
      <Title level={3}>Sales</Title>
      <br />
      {placeOrderMutation.isError && (
        <>
          <ErrorAlert error={placeOrderMutation.error as ApiError} />
          <br />
        </>
      )}
      <Row gutter={outletPadding}>
        <Col span={18}>
          <Row gutter={[outletPadding, outletPadding]}>
            <Col
              span={24}
              ref={node => {
                if (node) setSearchCardHeight(node.clientHeight);
              }}
            >
              <Card>
                <Flex gap="middle">
                  <Select
                    dropdownRender={() => (
                      <div
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        {(isLoading || isFetching) ? (
                          <div style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
                            <Spin />
                          </div>
                        ) : (
                          <div>
                            <List
                              size="small"
                              bordered
                              dataSource={Array.isArray(data?.results) ? data?.results : []}
                              rowKey={i => i.id}
                              renderItem={(item) => {
                                const position = selectedProducts.findIndex(p => p.itemId === item.id);

                                return (
                                  <List.Item
                                    style={{
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                      const temp = [...selectedProducts];

                                      if (position >= 0) {
                                        temp.splice(position, 1);
                                      } else {
                                        const foundProduct = data?.results.find(i => i.id === item.id);
                                        if (foundProduct) {
                                          temp.push({
                                            itemId: foundProduct.id,
                                            price: foundProduct.price,
                                            quantity: 1,
                                            name: foundProduct.name,
                                            vendorName: foundProduct.vendor.name,
                                          });
                                        }
                                      }

                                      setSelectedProducts(temp);
                                    }}
                                  >
                                    <List.Item.Meta
                                      title={item.name}
                                      description={item.vendor.name}
                                    />
                                    {position >= 0 && (
                                      <Text type="success">
                                        <CheckOutlined />
                                      </Text>
                                    )}
                                  </List.Item>
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    mode="multiple"
                    placeholder="Select product to add..."
                    size="large"
                    showSearch
                    style={{ width: '100%' }}
                    options={options}
                    onSearch={handleSearchTermChange}
                  />
                  <Select
                    size="large"
                    placeholder="Category"
                    style={{ width: 300 }}
                    onChange={(value) => setSelectedCategory(value || '')}
                    options={categories ? categories.map(category => ({
                      value: category.name,
                      label: category.name,
                    })) : []}
                    allowClear
                  />
                  <Select
                    size="large"
                    placeholder="Vendor"
                    style={{ width: 300 }}
                    onChange={(value) => setSelectedVendor(value || '')}
                    options={vendors ? vendors.map(vendor => ({ value: vendor.name, label: vendor.name })) : []}
                    allowClear
                  />
                </Flex>
              </Card>
            </Col>
            <Col span={24}>
              {searchCardHeight > 0 && (
                <div
                  style={{
                    height: `calc(100vh - ${headerHeight}px - ${outletPadding * 9}px - ${searchCardHeight}px)`,
                    overflowY: 'scroll',
                  }}
                >
                  <SelectedProductToSell
                    dataSource={selectedProducts}
                    updateQuantity={updateQuantity}
                    removeProduct={removeProduct}
                  />
                </div>
              )}
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Card
            style={{ position: 'sticky', top: headerHeight + outletPadding }}
          >
            <Descriptions title="Order Summary" items={items} column={1} />
            <Button block type="primary" onClick={handlePlaceOrder} loading={placeOrderMutation.isLoading}
                    disabled={selectedProducts.length === 0}>
              Place order
            </Button>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default Sales;