import { useQuery } from "@tanstack/react-query";


import useAxiosInstance from "../utils/Api";

export default function UseFetchAllHospital() {

const api=useAxiosInstance()
  const Fetchqr = async () => {
    return await api.get(`/hospital/manage/get-all`);
  };

  return useQuery({
    queryKey: ["fechAllHospital"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}