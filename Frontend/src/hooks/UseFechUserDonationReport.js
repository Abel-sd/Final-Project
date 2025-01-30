import { useQuery } from "@tanstack/react-query";


import useAxiosInstance from "../utils/Api";

export default function UseFetchUserDonationReport() {

const api=useAxiosInstance()
  const Fetchqr = async () => {
    return await api.get(`/schedule/manage/getmycompletedSchedules`);
  };

  return useQuery({
    queryKey: ["fechCourses"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}