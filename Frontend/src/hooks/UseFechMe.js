import { useQuery } from "@tanstack/react-query";


import useAxiosInstance from "../utils/Api";

export default function UseFetchMe() {

const api=useAxiosInstance()
  const Fetchqr = async () => {
    return await api.get(`/Donor/manage/getMyDonor`);
  };

  return useQuery({
    queryKey: ["fechME"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}