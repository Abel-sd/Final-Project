import { useQuery } from "@tanstack/react-query";


import useAxiosInstance from "../utils/Api";

export default function UseFetchMeHospital() {

const api=useAxiosInstance()
  const Fetchqr = async () => {
    return await api.get(`/hospital/manage/getMyHospital`);
  };

  return useQuery({
    queryKey: ["fechMeHospital"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}