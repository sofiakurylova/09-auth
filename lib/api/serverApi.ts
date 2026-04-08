import axios from "axios";
import { cookies } from "next/headers";

const createServerApi = async () => {
  const cookieStore = await cookies();
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
    headers: { Cookie: cookieStore.toString() },
    withCredentials: true,
  });
};

export const fetchNotesServer = async (params: any) => {
  const api = await createServerApi();
  const res = await api.get("/notes", { params });
  return res.data;
};

export const getMeServer = async () => {
  const api = await createServerApi();
  const res = await api.get("/users/me");
  return res.data;
};
