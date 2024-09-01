import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchFolder = () => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['fetch.folder'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.folder.list);
      const { folders } = response.data.data;
      console.log(folders);
      return folders;
    },
  });

  return {
    data,
    isLoading,
    isFetching,
  };
};