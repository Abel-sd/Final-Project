import { useQuery } from "@tanstack/react-query";


import useAxiosInstance from "../utils/Api";

export default function UseFetchAllDonor() {

const api=useAxiosInstance()
  const Fetchqr = async () => {
    return await api.get(`/donor/manage/get-all`);
  };

  return useQuery({
    queryKey: ["fechAllDonor"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}