import { Form, FormInstance, Input, Radio, Select } from 'antd';
import { useState } from 'react';
import { Customer } from '../types/ReceiptDto.ts';
import { useQuery } from 'react-query';
import { ApiClient } from '../api/apiClient.ts';

const { Option } = Select;

const EXISTING_CUSTOMER = 'EXISTING_CUSTOMER';
const NEW_CUSTOMER = 'NEW_CUSTOMER';

type CustomerType = typeof EXISTING_CUSTOMER | typeof NEW_CUSTOMER;

type Props = {
  // customerInfo: Customer,
  // setCustomerInfo: Dispatch<SetStateAction<Customer>>
  form: FormInstance<Customer>
}

export const CustomerForm = ({ form }: Props) => {
  const [customerType, setCustomerType] = useState<CustomerType>('NEW_CUSTOMER');

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => await ApiClient.get<never, Customer[]>('api/Customers'),
  });

  return (
    <section>
      <Radio.Group
        optionType="button"
        defaultValue="NEW_CUSTOMER"
        onChange={e => setCustomerType(e.target.value)}>
        <Radio value={NEW_CUSTOMER}>New customer</Radio>
        <Radio value={EXISTING_CUSTOMER}>Existing customer</Radio>
      </Radio.Group>
      <p />
      <Form
        form={form}
        autoComplete="off"
        layout="vertical"
      >
        {customerType === 'NEW_CUSTOMER' ? (
          <>
            <Form.Item<Customer>
              name="name"
              rules={[{ required: true, message: 'Customer name is required!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item<Customer>
              name="phoneNumber"
              rules={[{ required: true, message: 'Customer phone number is required!' }]}
            >
              <Input placeholder="Phone number" />
            </Form.Item>
            <Form.Item<Customer>
              name="address"
            >
              <Input.TextArea placeholder="Address" />
            </Form.Item>
          </>
        ) : (
          <Form.Item<Customer>
            name="id"
            rules={[{ required: true, message: 'Customer is required!' }]}
          >
            <Select
              placeholder="Select existing customer"
              loading={customersLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input: string, option?: { children: string }) => {
                return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
              }}
            >
              {Array.isArray(customers) && (
                customers.map(c => (
                  <Option key={c.id} value={c.id}>{`${c.name}, ${c.phoneNumber}`}</Option>
                ))
              )}
            </Select>
          </Form.Item>
        )}
      </Form>
    </section>
  );
};