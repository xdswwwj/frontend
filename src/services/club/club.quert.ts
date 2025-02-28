import API_URL from "@/config/api.url";
import { HttpMethodEnum, useAuthCheckQuery } from "../common";

export const useClubList = (search: string, page: number) => {
  // API에서 page와 search 파라미터를 사용할 수 있도록 URL에 쿼리스트링을 추가합니다.
  const url = `${API_URL.LIST_CLUB}?page=${page}${
    search ? `&search=${encodeURIComponent(search)}` : ""
  }`;

  return useAuthCheckQuery({
    apiUrl: url,
    queryKey: ["clubList", search, page.toString()], // 검색어와 페이지가 변경되면 자동 refetch
    method: HttpMethodEnum.GET,
  });
};
