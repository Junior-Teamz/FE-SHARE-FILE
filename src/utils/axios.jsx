import axios from 'axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API, withCredentials: true });

// Request interceptor (tidak perlu menambahkan header Authorization karena menggunakan cookie HTTP-only)
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/admin/index',
    login: '/api/login',
    logout: '/api/logout',
    register: '/api/auth/register',
  },
  files: {
    upload: '/api/admin/file/upload',
  },
  folder: {
    detail: '/api/admin/folder/info/',
    list: '/api/admin/folder', //folder list
    create: '/api/admin/folder/create', //create list
    delete: '/api/admin/folder/delete', //delete folder
    edit: '/api/admin/folder/update', //edit folder
  },
  users: {
    list: '/api/admin/users/list',
    create: '/api/admin/users/create_user',
    update: '/api/admin/users/update_user',
    delete: '/api/admin/users/delete_user',
  },
  instance:{
    list:'api/admin/instance/index',
    create:'api/admin/instance/create',
    update:'api/admin/instance/update',
    delete:'api/admin/instance/delete'
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
