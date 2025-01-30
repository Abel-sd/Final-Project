import { useQuery } from "@tanstack/react-query";


import useAxiosInstance from "../utils/Api";

export default function UseFetchAllInventoryReport() {

const api=useAxiosInstance()
  const Fetchqr = async () => {
    return await api.get(`/inventory/manage/get-all`);
  };

  return useQuery({
    queryKey: ["fechAllInventoryReport"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}