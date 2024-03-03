import {useEffect, useRef, useState} from "react";
import {Button, Input, InputRef, message, Modal, Skeleton, Space, Spin} from "antd";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {ApiClient} from "../api/apiClient.ts";
import {NamedApiResource} from "../types/Item.ts";
import Title from "antd/es/typography/Title";
import {ExclamationCircleFilled, PlusOutlined, SyncOutlined} from "@ant-design/icons";
import {ErrorAlert} from "./ErrorAlert.tsx";
import {ApiError} from "../types/ApiError.ts";

const {confirm} = Modal;

type Props = {
  type: "categories" | "vendors";
}

export const CategoriesOrVendors = ({type}: Props) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  const queryClient = useQueryClient();

  const {data, isLoading, isFetching} = useQuery({
    queryKey: [type],
    queryFn: async () => await ApiClient.get<never, NamedApiResource[]>(`api/${type}`),
    select: (data) => data.sort((a, b) => a.id - b.id)
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => await ApiClient.post<never, NamedApiResource>(`api/${type}?name=${name}`),
    onSuccess: (response) => {
      const queryData = queryClient.getQueryData<NamedApiResource[]>([type]);
      if (!!queryData) {
        queryData.push(response);
        queryClient.setQueryData([type], queryData);
      }
      message.success('Successfully created!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await ApiClient.delete(`api/${type}/${id}`),
    onSuccess: (_, id) => {
      const queryData = queryClient.getQueryData<NamedApiResource[]>([type]);
      if (!!queryData) {
        const indexToDelete = queryData.findIndex(item => item.id === id);
        indexToDelete >= 0 && queryData.splice(indexToDelete, 1);
        queryClient.setQueryData([type], queryData);
      }
      message.success('Successfully deleted!');
      setEditInputIndex(-1);
      setEditInputValue('');
      editInputRef.current?.blur();
    }
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      name: string,
      id: number
    }) => await ApiClient.put<never, NamedApiResource>(`api/${type}/${payload.id}?name=${payload.name}`),
    onSuccess: (_, response) => {
      const queryData = queryClient.getQueryData<NamedApiResource[]>([type]);
      if (!!queryData) {
        const newQueryData = queryData.map(item => {
          if (item.id === response.id) {
            return response;
          }
          return item;
        });
        queryClient.setQueryData([type], newQueryData);
      }
      message.success('Successfully updated!');
      setEditInputIndex(-1);
      setEditInputValue('');
      editInputRef.current?.blur();
    },
  });

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const createNewItem = async () => {
    if (inputValue && Array.isArray(data)) {
      if (!data.find(c => c.name.toLowerCase() === inputValue.trim().toLowerCase()))
        await createMutation.mutateAsync(inputValue);
      else
        message.warning(`${inputValue} already exists!`);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const updateItem = async () => {
    if (editInputValue && Array.isArray(data)) {
      if (!data.find(c => c.name.toLowerCase() === editInputValue.trim().toLowerCase())) {
        const item = data[editInputIndex];
        await updateMutation.mutateAsync({
          name: editInputValue,
          id: item.id
        });
      } else {
        message.warning(`${editInputValue} already exists!`);
      }
    }
  };

  const handleEditInputCancel = () => {
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  return (
    <section>
      <Space align="baseline">
        <Title level={3}>{type.charAt(0).toUpperCase() + type.slice(1)}</Title>
        {isFetching && <SyncOutlined spin/>}
      </Space>
      <br/>
      <br/>
      {isLoading ? (
        <>
          <Skeleton active/>
          <Skeleton active/>
        </>
      ) : (
        <Space size={[20, 20]} wrap>
          {Array.isArray(data) && data.map((item, index) => {
            if (editInputIndex === index) {
              return (
                <Spin spinning={updateMutation.isLoading}>
                  <Input
                    ref={editInputRef}
                    key={item.id}
                    value={editInputValue}
                    onChange={handleEditInputChange}
                    onBlur={handleEditInputCancel}
                    onPressEnter={updateItem}
                    onKeyDown={(e) => {
                      if (e.key === 'Delete') {
                        confirm({
                          title: `Do you really want to delete this ${type === "categories" ? 'category' : 'vendor'}?`,
                          icon: <ExclamationCircleFilled/>,
                          content: 'All the related products will be deleted too.',
                          onOk() {
                            return deleteMutation.mutateAsync(item.id);
                          },
                        });
                      }
                    }}
                  />
                </Spin>
              );
            }

            return (
              <Input
                variant="filled"
                onFocus={() => {
                  setEditInputIndex(index);
                  setEditInputValue(item.name);
                }}
                key={item.id}
                value={item.name}
              />
            );
          })}


          {inputVisible ? (
            <Spin spinning={createMutation.isLoading}>
              <Input
                placeholder={`${type === 'categories' ? 'Category' : 'Vendor'} name`}
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onPressEnter={createNewItem}
              />
            </Spin>
          ) : (
            <Button
              type="dashed"
              icon={<PlusOutlined/>}
              onClick={showInput}
              style={{width: '196px'}}
            >
              New {type === 'categories' ? 'category' : 'vendor'}
            </Button>
          )}
        </Space>
      )}
      <br/>
      <br/>
      {updateMutation.isError && (
        <ErrorAlert error={updateMutation.error as ApiError}/>
      )}
    </section>
  );
}