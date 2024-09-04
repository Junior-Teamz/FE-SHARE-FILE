import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditUser = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.user'],
    mutationFn: async ({ userId, data }) => {
      const response = await axiosInstance.put(`${endpoints.users.update}/${userId}`, data);
      console.log(response);
      return response;
    },
    onSuccess,
    onError,
  });
};
