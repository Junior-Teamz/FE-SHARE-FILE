import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationFolder = ({ onSuccess }) => {
  return useMutation({
    mutationKey: ['create.folder'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.folder.create, data);
      return response;
    },
    onSuccess,
  });
};

export const useDeleteFolder = () => {
  const { mutate, isPending } = useMutation({
    mutationKey: ['delete.folder'],
    mutationFn: async (folderId) => {
      const response = await axiosInstance.delete(`${endpoints.folder.delete}/${folderId}`);
      console.log(response);
      return response;
    },
  });
  return {
    mutate,
    isPending,
  };
};



export const useEditFolder = () => {
  const { mutate, isPending } = useMutation({
    mutationKey: ['edit.folder'],
    mutationFn: async ({ folderId, data }) => {
      const response = await axiosInstance.put(`${endpoints.folder.edit}/${folderId}`, data);
      console.log(response);
      return response;
    },
  });
  return {
    mutate,
    isPending,
  };
};
