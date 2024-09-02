import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteFolder = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['delete.folder'],
    mutationFn: async (folderId) => {
      const response = await axiosInstance.delete(`${endpoints.folder.delete}/${folderId}`);
      console.log(response);
      return response;
    },
    onSuccess,
    onError,
  });
};
