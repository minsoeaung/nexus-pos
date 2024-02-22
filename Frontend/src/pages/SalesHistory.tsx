import Title from 'antd/es/typography/Title';
import { Card } from 'antd';
import { useQuery } from 'react-query';
import { ApiClient } from '../api/apiClient.ts';
import { Receipt } from '../types/ReceiptDto.ts';

const SalesHistory = () => {
  const { data } = useQuery({
    queryKey: ['receipts'],
    queryFn: async () => await ApiClient.get<never, Receipt[]>('api/Receipts'),
  });

  return (
    <section>
      <Title level={3}>Sales History</Title>
      <br />
      <Card>

      </Card>
    </section>
  );
};

export default SalesHistory;