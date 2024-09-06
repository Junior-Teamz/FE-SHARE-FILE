import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteInstance = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['delete.instansi'],
    mutationFn: async (instansiId) => {
      const response = await axiosInstance.delete(`${endpoints.instance.delete}/${instansiId}`);
      console.log(response);
      return response;
    },
    onSuccess,
    onError,
  });
};
