import {Badge, Button, Card, Input, message, Popconfirm, Space, Table, TableProps, Tag} from 'antd';
import {useMutation, useQuery} from 'react-query';
import {useSearchParams} from 'react-router-dom';
import {ApiClient} from '../api/apiClient.ts';
import {PagedResponse} from '../types/PagedResponse.ts';
import {Item, NamedApiResource} from '../types/Item.ts';
import {FunctionComponent, useCallback, useMemo, useRef, useState} from 'react';
import {ItemModal} from '../components/ItemModal.tsx';
import {ItemDto} from '../types/ItemDto.ts';
import Title from 'antd/es/typography/Title';
import {DeleteOutlined, EditOutlined, PlusOutlined, RedoOutlined, StopOutlined, TagOutlined} from '@ant-design/icons';
import {ApiError} from '../types/ApiError.ts';
import {SearchProps} from 'antd/es/input';
import Highlighter from 'react-highlight-words';

const {Search} = Input;

export const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type ItemModalBasicProps = {
  type: 'create' | 'update',
  open: boolean,
  data: ItemDto | undefined,
}

const Products: FunctionComponent = () => {

  const [params, setParams] = useSearchParams();
  const [modalProps, setModalProps] = useState<ItemModalBasicProps>({
    type: 'create',
    open: false,
    data: undefined,
  });

  const updatingProductId = useRef(0);

  const {data, isLoading, isFetching, refetch} = useQuery({
    queryKey: ['products', params.toString()],
    queryFn: async () => await ApiClient.get<never, PagedResponse<Item>>(`api/items?${params.toString()}`),
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

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => await ApiClient.delete(`api/items/${id}`),
    onSuccess: () => {
      message.success('Deleted Successfully!');
      refetch();
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ItemDto) => {
      // data.stock = Number(data.stock);
      // data.price = Number(data.price);
      return await ApiClient.post<never, Item>('api/items', data);
    },
    onSuccess: () => {
      message.success('Created Successfully!');
      setModalProps({
        type: 'create',
        open: false,
        data: undefined,
      });
      refetch();
    },
  });

  type Payload = {
    data: ItemDto,
    id: number
  }

  const updateProductMutation = useMutation({
    mutationFn: async (payload: Payload) => {
      const data = payload.data;
      data.stock = Number(data.stock);
      data.price = Number(data.price);
      return await ApiClient.put<never, Item>(`api/items/${payload.id}`, data);
    },
    onSuccess: () => {
      message.success('Updated Successfully!');
      setModalProps({
        type: 'create',
        open: false,
        data: undefined,
      });
      refetch();
    },
  });

  const columns = useMemo(() => {
    const columns: TableProps<Item>['columns'] = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        width: '5%',
        render: (id) => id,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        render: (name) => {
          const searchTerm = params.get('searchTerm') || '';
          if (!!searchTerm.trim()) {
            return (
              // @ts-ignore
              <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[searchTerm]}
                autoEscape
                textToHighlight={name}
              />
            );
          } else {
            return name;
          }
        },
      },
      {
        title: 'Stock',
        dataIndex: 'stock',
        key: 'stock',
        sorter: true,
        width: '10%',
        render: (_, record) => <Badge status={record.stock > 20 ? 'success' : 'warning'} text={record.stock}/>,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        sorter: true,
        width: '10%',
        render: (_, record) => (
          <Space>
            <TagOutlined style={{color: 'green'}}/>
            <p style={{marginRight: '10px', color: 'green'}}>
              {USDollar.format(record.price)}
            </p>
          </Space>
        ),
      },
      {
        title: 'Vendor',
        dataIndex: 'vendor',
        key: 'vendor',
        width: '15%',
        filters: vendors ? vendors.map(v => ({text: v.name, value: v.name})) : [],
        defaultFilteredValue: params.get('vendors') ? params.get('vendors')!.split(',') : [],
        render: (_, record) => record.vendor.name,
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: '15%',
        filters: categories ? categories.map(v => ({text: v.name, value: v.name})) : [],
        defaultFilteredValue: params.get('categories') ? params.get('categories')!.split(',') : [],
        render: (_, record) => record.category.name,
      },
      {
        title: 'Added By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: '15%',
        render: (_, record) => <Tag
          color={record.createdBy.suspend ? 'error' : 'blue'}
          icon={record.createdBy.suspend ? <StopOutlined/> : null}>{record.createdBy.userName}</Tag>,
      },
      {
        title: 'Created Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '15%',
        render: (createdAt) => new Date(createdAt).toLocaleDateString('en-GB'),
      },
      {
        title: 'Actions',
        key: 'options',
        fixed: 'right',
        render: (_, record) => (
          <Space>
            <Button
              type="link"
              onClick={() => {
                updatingProductId.current = record.id;
                setModalProps({
                  type: 'update',
                  open: true,
                  data: {
                    name: record.name,
                    price: record.price,
                    stock: record.stock,
                    categoryId: record.category?.id,
                    vendorId: record.vendor?.id,
                  },
                });
              }}
              icon={<EditOutlined/>}
              size="small"
              data-cy="editProductBtn"
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure?"
              onConfirm={async () => {
                await deleteProductMutation.mutateAsync(record.id);
              }}
              okButtonProps={{
                loading: deleteProductMutation.isLoading,
                id: "deleteConfirmBtn"
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger type="link" icon={<DeleteOutlined/>} size="small"
                      data-cy="deleteProductBtn">Delete</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return columns;
  }, [categories, vendors, params]);

  const handleTableChange = useCallback<NonNullable<TableProps<Item>['onChange']>>((pagination, filters, sorter) => {
    // Paginate
    params.set('pageNumber', String(pagination.current));
    params.set('pageSize', String(pagination.pageSize));

    // Filter
    if (Array.isArray(filters.category))
      params.set('categories', filters.category.join(','));
    else if (filters.category === null)
      params.set('categories', '');

    if (Array.isArray(filters.vendor))
      params.set('vendors', filters.vendor.join(','));
    else if (filters.vendor === null)
      params.set('vendors', '');

    // Warning "columnKey" does not exist in type SorterResult, but it is there
    // So, workaround is needed
    const mySorter = sorter as {
      columnKey: string;
      order: 'ascend' | 'descend' | undefined;
    };

    const orderMap = {
      ascend: '',
      descend: 'Desc',
    } as const;

    if (!mySorter.order) {
      params.set('orderBy', '');

    } else {
      params.set('orderBy', `${mySorter.columnKey}${orderMap[mySorter.order]}`);
    }

    setParams(params);
  }, []);

  const onSearch: SearchProps['onSearch'] = (value) => {
    const searchTerm = value.trim();
    if (searchTerm.length > 0) {
      params.set('searchTerm', searchTerm);
    } else {
      params.set('searchTerm', '');
    }
    setParams(params);
  };

  const handleModalSubmit = useCallback(async (data: ItemDto) => {
    if (!data) return;

    if (modalProps.type === 'create') {
      await createProductMutation.mutateAsync(data);
    } else {
      await updateProductMutation.mutateAsync({
        data,
        id: updatingProductId.current,
      });
    }
  }, [modalProps.type]);

  const handleModalCancel = useCallback(() => {
    setModalProps({
      type: 'create',
      open: false,
      data: undefined,
    });
  }, []);

  return (
    <section>
      <Title level={3} data-cy="products">Products</Title>
      <br/>
      <Card
        headStyle={{
          borderBottom: 'none',
        }}
        extra={
          <Space>
            <Search
              defaultValue={params.get('searchTerm') || ''}
              allowClear
              placeholder="Search product name..."
              onSearch={onSearch}
              style={{width: 250}}
              enterButton
            />
            <Button
              type="primary"
              icon={<PlusOutlined/>}
              onClick={() => {
                setModalProps({
                  type: 'create',
                  data: undefined,
                  open: true,
                });
              }}
              data-cy="addproduct"
            >
              Add product
            </Button>
            <Button
              icon={<RedoOutlined/>}
              onClick={() => refetch()}
            />
          </Space>
        }
      >
        <Table
          bordered
          size="small"
          loading={isLoading || isFetching}
          columns={columns}
          rowKey={record => record.id}
          dataSource={data ? data.results : []}
          pagination={{
            current: data?.pagination.currentPage || 1,
            pageSize: data?.pagination.pageSize || 10,
            total: data?.pagination.totalCount,
            size: 'default',
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          onChange={handleTableChange}
        />
      </Card>
      <ItemModal
        type={modalProps.type}
        open={modalProps.open}
        data={modalProps.data}
        onSubmit={handleModalSubmit}
        onCancel={handleModalCancel}
        loading={createProductMutation.isLoading || updateProductMutation.isLoading}
        error={(createProductMutation.error || updateProductMutation.error) as ApiError}
      />
    </section>
  );
};

export default Products;