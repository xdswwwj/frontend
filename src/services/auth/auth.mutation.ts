import API_URL from "@/config/api.url";
import { useToast } from "@/hooks/use-toast";
import useUserStore from "@/store/userStore";
import { authCheckMutation, HttpMethodEnum } from "../common";

export const useUpdateUserInfoMutation = () => {
  const { user, setUser } = useUserStore();
  const { toast } = useToast();
  return authCheckMutation({
    apiUrl: API_URL.INFO_UPDATE,
    method: HttpMethodEnum.POST,
    queryKey: ["userInfo"],
    onSuccess: (res) => {
      const { data } = res;
      setUser({ ...user, ...data });
      toast({
        title: "Success!",
        description: "Mutation 성공적으로 완료되었습니다.",
        duration: 3000,
      });
    },
  });
};
