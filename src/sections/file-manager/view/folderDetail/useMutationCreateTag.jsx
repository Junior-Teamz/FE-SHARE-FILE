import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreateTag = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.tag'],
    mutationFn: async (tagName) => {
      const response = await axiosInstance.post(endpoints.tag.create, { name: tagName });
      return response.data; // Pastikan respons mengembalikan tag_id
    },
    onSuccess,
    onError,
  });
};
