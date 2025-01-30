import { useQuery } from "@tanstack/react-query";


import useAxiosInstance from "../utils/Api";

export default function UseFetchAllScheduledBlood() {

const api=useAxiosInstance()
  const Fetchqr = async () => {
    return await api.get(`/schedule/manage/get-all`);
  };

  return useQuery({
    queryKey: ["fechAllScheduledBlood"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}