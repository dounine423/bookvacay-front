// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

// export const FormAPI = axios.create({ baseURL: 'https://bookvacay.online/server', headers: { 'Content-Type': 'multipart/form-data' } })
// export const API = axios.create({ baseURL: 'https://bookvacay.online/server', headers: { 'Content-Type': 'application/json' } })
export const API = axios.create({ baseURL: 'http://127.0.0.1:5000', headers: { 'Content-Type': 'application/json' } })
export const FormAPI = axios.create({ baseURL: 'http://127.0.0.1:5000', headers: { 'Content-Type': 'multipart/form-data' } })

// export const API = axios.create({ baseURL: 'https://crud.solutions/server', headers: { 'Content-Type': 'application/json' } })
// export const FormAPI = axios.create({ baseURL: 'https://crud.solutions/server', headers: { 'Content-Type': 'multipart/form-data' } })




