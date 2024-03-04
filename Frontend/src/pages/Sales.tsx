import {
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsProps,
  Flex,
  List,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Typography,
} from 'antd';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {ApiClient} from '../api/apiClient.ts';
import {Item as ItemType, NamedApiResource} from '../types/Item.ts';
import {headerHeight} from '../components/AppHeader.tsx';
import {outletPadding} from './RootLayout.tsx';
import {useCallback, useEffect, useRef, useState} from 'react';
import {SelectedProduct, SelectedProductToSell} from '../components/SelectedProductToSell.tsx';
import {PagedResponse} from '../types/PagedResponse.ts';
import {LabeledValue} from 'antd/es/select';
import {CheckOutlined} from '@ant-design/icons';
import {USDollar} from './Products.tsx';
import {ReceiptRequest} from '../types/ReceiptRequest.ts';
import {ErrorAlert} from '../components/ErrorAlert.tsx';
import {ApiError} from '../types/ApiError.ts';
import {CustomerForm} from '../components/CustomerForm.tsx';
import {Customer} from '../types/ReceiptDto.ts';
import {useForm} from 'antd/es/form/Form';

const {Title, Text} = Typography;

const Sales = () => {
  const [searchCardHeight, setSearchCardHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<LabeledValue[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  const [form] = useForm<Customer>();

  const queryClient = useQueryClient();

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const {data, isLoading, isFetching, refetch} = useQuery({
    queryKey: ['products', {selectedCategory, selectedVendor, searchTerm}],
    queryFn: async () => await ApiClient.get<never, PagedResponse<ItemType>>(`api/items?searchTerm=${searchTerm}&categories=${selectedCategory}&vendors=${selectedVendor}`),
    onSuccess: (data) => {
      setOptions(data.results.map(product => ({value: product.id, label: product.name})));
    },
    keepPreviousData: true,
  });

  const {data: categories} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await ApiClient.get<never, NamedApiResource[]>('api/categories'),
  });

  const {data: vendors} = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => await ApiClient.get<never, NamedApiResource[]>('api/vendors'),
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (payload: ReceiptRequest) => await ApiClient.post('api/Receipts', payload),
    onSuccess: async () => {
      setSelectedProducts([]);
      form.resetFields();
      await queryClient.invalidateQueries(['customers']);
      Modal.success({
        content: 'Order successfully processed!',
      });
    },
  });

  useEffect(() => {
    refetch();
  }, []);

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
    if (selectedProducts.length === 0) {
      message.warning('No product selected.');
      return;
    }

    await form.validateFields();

    await placeOrderMutation.mutateAsync({
      customerId: form.getFieldValue('id') || 0,
      name: form.getFieldValue('name') || '',
      address: form.getFieldValue('address') || '',
      phoneNumber: form.getFieldValue('phoneNumber') || '',
      orderItems: selectedProducts.map(p => ({itemId: p.itemId, quantity: p.quantity})),
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
      children: (
        <span style={{color: 'green', fontWeight: 'bold'}}>
          {USDollar.format(selectedProducts.reduce((previousValue, product) => previousValue + (product.quantity * product.price), 0))}
        </span>
      ),
    },
    {
      key: '4',
      label: 'Total',
      children: (
        <span style={{color: 'green', fontWeight: 'bold'}}>
          {USDollar.format(selectedProducts.reduce((previousValue, product) => previousValue + (product.quantity * product.price), 0))}
        </span>
      ),
    },
  ];

  // if (success) {
  //   return (
  //     <Result
  //       status="success"
  //       title="Successfully Processed Order!"
  //       extra={[
  //         <Button onClick={() => setSuccess(false)}>Order Again</Button>,
  //       ]}
  //     />
  //   );
  // }

  return (
    <section>
      <Title level={3}>Sales</Title>
      <br/>
      {placeOrderMutation.isError && (
        <>
          <ErrorAlert error={placeOrderMutation.error as ApiError}/>
          <br/>
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
                          <div style={{textAlign: 'center', paddingTop: '20px', paddingBottom: '20px'}}>
                            <Spin/>
                          </div>
                        ) : (
                          <div>
                            <List
                              size="small"
                              bordered
                              dataSource={Array.isArray(data?.results) ? data?.results : []}
                              rowKey={i => i.id}
                              style={{maxHeight: '60vh', overflowY: "scroll"}}
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
                                        <CheckOutlined/>
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
                    style={{width: '100%'}}
                    options={options}
                    onSearch={handleSearchTermChange}
                  />
                  <Select
                    size="large"
                    placeholder="Category"
                    style={{width: 300}}
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
                    style={{width: 300}}
                    onChange={(value) => setSelectedVendor(value || '')}
                    options={vendors ? vendors.map(vendor => ({value: vendor.name, label: vendor.name})) : []}
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
            style={{position: 'sticky', top: headerHeight + outletPadding}}
          >
            <Descriptions title="Order Summary" items={items} column={1}/>
            <Card title="Customer info" size="small" headStyle={{fontSize: '0.8rem'}}>
              <CustomerForm form={form}/>
            </Card>
            <br/>
            <Button size="large" block type="primary" onClick={handlePlaceOrder} loading={placeOrderMutation.isLoading}>
              Place order
            </Button>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default Sales;