import Pagination from "@/components/pagination/Pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEY } from "@/lib/fetch";
import { JwtTokenPayload } from "@/services/api";
import { useClubList } from "@/services/club/club.query";
import useUserStore from "@/store/userStore";
import { jwtDecode } from "jwt-decode";
import { Club, SearchIcon } from "lucide-react";
import React, { useState } from "react";

interface ClubListContainerProps {
  isMyClub?: boolean;
  title?: string;
}

const ClubListContainer: React.FC<ClubListContainerProps> = (props) => {
  const { isMyClub, title } = props;
  const { token } = useUserStore();
  // 사용자가 입력하는 검색어 상태
  const [searchInput, setSearchInput] = useState<string>("");
  // 실제 API에 반영될 검색어 상태 (검색 버튼 클릭 시 업데이트)
  const [appliedSearch, setAppliedSearch] = useState<string>("");
  // 현재 페이지 상태
  const [page, setPage] = useState<number>(1);

  const queryKey: string = isMyClub
    ? QUERY_KEY.MY_CLUB_LIST
    : QUERY_KEY.CLUB_LIST;

  // appliedSearch와 page를 기반으로 데이터 요청
  const { data: clubList, isLoading } = useClubList({
    search: appliedSearch,
    page,
    isMyClub,
    queryKey,
  });

  const decoded: JwtTokenPayload = jwtDecode(token);

  // 검색 폼 제출 시
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 새로운 검색을 하면 페이지를 1로 초기화합니다.
    setAppliedSearch(searchInput);
    setPage(1);
  };

  if (isLoading) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
  }

  const emptyList = clubList?.data?.length === 0;
  const emptyListMessage: React.ReactNode = isMyClub
    ? "내 클럽 목록이 없습니다."
    : "검색 결과가 없습니다.";

  const { meta } = clubList;
  const { totalPages } = meta;
  return (
    <>
      {!isMyClub && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 mb-4"
        >
          <Input
            type="text"
            placeholder="클럽 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full"
          />
          <Button type="submit">
            <SearchIcon className="h-4 w-4 mr-2" />
            검색
          </Button>
        </form>
      )}

      <div className="w-full max-w p-4 bg-white rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-4">
          {title ? title : "클럽 목록"}
        </h2>
        <div className="space-y-3">
          {emptyList && emptyListMessage}
          {clubList?.data?.map((club: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              {/* Avatar & Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={club.image} alt={club.name} />
                  <AvatarFallback>
                    <Club />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{club.name}</p>
                  <p className="text-xs text-gray-500">{club.description}</p>
                </div>
              </div>

              {/* Club join button (본인이 리더가 아니면) */}
              {decoded.id !== club.leader.id && <Button>가입 신청</Button>}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {!isMyClub && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </>
  );
};

export default ClubListContainer;
