import {Form, Input, Modal, Select} from 'antd';
import {ItemDto} from '../types/ItemDto.ts';
import {useQuery} from 'react-query';
import {ApiClient} from '../api/apiClient.ts';
import {NamedApiResource} from '../types/Item.ts';
import {memo, useEffect} from 'react';
import {ErrorAlert} from './ErrorAlert.tsx';
import {ApiError} from '../types/ApiError.ts';

type ItemModalProps = {
  type: 'create' | 'update',
  open: boolean,
  data: ItemDto | undefined,
  onSubmit: (updatedData: ItemDto) => void,
  onCancel: () => void,
  loading: boolean,
  error: ApiError | undefined | null
}

export const ItemModal = memo(({type, open, data, onSubmit, onCancel, loading, error}: ItemModalProps) => {
  const [form] = Form.useForm();

  const {data: categories} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await ApiClient.get<never, NamedApiResource[]>('api/categories'),
  });

  const {data: vendors} = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => await ApiClient.get<never, NamedApiResource[]>('api/vendors'),
  });

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  useEffect(() => {
    if (open && data)
      form.setFieldsValue(data);
    else
      form.resetFields();
  }, [open]);

  return (
    <Modal
      title={type === 'create' ? 'Add product' : 'Edit product'}
      open={open}
      onOk={handleModalOk}
      onCancel={onCancel}
      okText={type === 'create' ? 'Add' : 'Save changes'}
      okButtonProps={{loading, id: "modalOkButton"}}
    >
      <br/>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item<ItemDto>
          label="Name"
          name="name"
          rules={[{required: true, message: 'Please input item name!'}]}
        >
          <Input placeholder="Please enter product name"/>
        </Form.Item>

        <Form.Item<ItemDto>
          label="Vendor"
          name="vendorId"
          rules={[{required: true, message: 'Please select vendor!'}]}
        >
          <Select placeholder="Please select vendor" data-cy="vendorId">
            {Array.isArray(vendors) && vendors.map((vendor, index) => (
              <Select.Option key={vendor.id} value={vendor.id} data-cy={"vendor" + index}>{vendor.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item<ItemDto>
          label="Category"
          name="categoryId"
          rules={[{required: true, message: 'Please select category!'}]}
        >
          <Select placeholder="Please select category" data-cy="categoryId">
            {Array.isArray(categories) && categories.map((category, index) => (
              <Select.Option key={category.id} value={category.id}
                             data-cy={"category" + index}>{category.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item<ItemDto>
          label="Price"
          name="price"
          rules={[
            {required: true, message: 'Please enter price!'},
          ]}
        >
          <Input prefix="$" placeholder="Please enter price of the product"/>
        </Form.Item>

        <Form.Item<ItemDto>
          label="Stock"
          name="stock"
          rules={[
            {required: true, message: 'Please enter stock!'},
          ]}
        >
          <Input placeholder="Please enter quantity in stock"/>
        </Form.Item>
      </Form>
      {error && (
        <ErrorAlert error={error}/>
      )}
      <br/>
    </Modal>
  );
});