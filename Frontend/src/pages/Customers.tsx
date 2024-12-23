import {Button, Card, Input, InputRef, Space, Table, TableColumnType, TableProps} from 'antd';
import Title from 'antd/es/typography/Title';
import {useQuery} from 'react-query';
import {ApiClient} from '../api/apiClient.ts';
import {CustomerResponse} from '../types/CustomerResponse.ts';
import {RedoOutlined, SearchOutlined} from '@ant-design/icons';
import type {FilterDropdownProps} from 'antd/es/table/interface';
import {useRef, useState} from 'react';
import Highlighter from 'react-highlight-words';

type DataIndex = keyof CustomerResponse;

const Customers = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const searchInput = useRef<InputRef>(null);

    const {data, isLoading, isFetching, refetch} = useQuery({
        queryKey: ['customers'],
        queryFn: async () => await ApiClient.get<never, CustomerResponse[]>('api/Customers'),
    });

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<CustomerResponse> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false});
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                // @ts-ignore
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: TableProps<CustomerResponse>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => record.name,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            filterMode: 'menu',
            render: (_, record) => record.phoneNumber,
            ...getColumnSearchProps('phoneNumber'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (_, record) => record.address,
            ...getColumnSearchProps('address'),
        },
    ];

    return (
        <section>
            <Title level={3}>Customers</Title>
            <br/>
            <Card
                extra={
                    <Button
                        icon={<RedoOutlined/>}
                        onClick={() => refetch()}
                    />
                }
            >
                <Table
                    size="small"
                    loading={isLoading || isFetching}
                    columns={columns}
                    dataSource={data}
                />
            </Card>
        </section>
    );
};

export default Customers;