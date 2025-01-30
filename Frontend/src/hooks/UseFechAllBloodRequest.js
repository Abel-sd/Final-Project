import { useQuery } from "@tanstack/react-query";


import useAxiosInstance from "../utils/Api";

export default function UseFetchAllBloodRequest() {

const api=useAxiosInstance()
  const Fetchqr = async () => {
    return await api.get(`/bloodrequest/manage/get-all`);
  };

  return useQuery({
    queryKey: ["fechAllBloodRequest"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}