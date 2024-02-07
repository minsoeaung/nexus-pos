import { Form, Input, Modal } from 'antd';
import { ErrorAlert } from './ErrorAlert.tsx';
import { ApiError } from '../types/ApiError.ts';
import { AdminDto } from '../types/AdminDto.ts';

type Props = {
  open: boolean,
  onSubmit: (updatedData: AdminDto) => void,
  onCancel: () => void,
  loading: boolean,
  error: ApiError | undefined | null
}

export const AdminModal = ({ onCancel, loading, error, onSubmit, open }: Props) => {
  const [form] = Form.useForm();

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

  return (
    <Modal
      title="Create admin account"
      open={open}
      onOk={handleModalOk}
      onCancel={onCancel}
      okText="Submit"
      okButtonProps={{ loading }}
    >
      <br />
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item<AdminDto>
          label="UserName"
          name="userName"
          rules={[{ required: true, message: 'Please enter username!' }]}
        >
          <Input placeholder="Please enter username" />
        </Form.Item>

        <Form.Item<AdminDto>
          label="Email"
          name="email"
          rules={[{ type: 'email', required: true, message: 'Please enter email!' }]}
        >
          <Input type="email" placeholder="Please enter email" />
        </Form.Item>

        <Form.Item<AdminDto>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter password!' }]}
        >
          <Input placeholder="Please enter password" />
        </Form.Item>
      </Form>
      {error && (
        <ErrorAlert error={error} />
      )}
      <br />
    </Modal>
  );
};