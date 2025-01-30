import { useQuery } from "@tanstack/react-query";


import useAxiosInstance from "../utils/Api";

export default function UseFetchBloodRequest() {

const api=useAxiosInstance()
  const Fetchqr = async () => {
    return await api.get(`/bloodrequest/manage/getMyBloodRequest`);
  };

  return useQuery({
    queryKey: ["fechBloodRequest"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}