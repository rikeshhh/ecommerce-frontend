"use client";

import { DataTable } from "@/components/admin/Data-Table/data-table";
import { useCommentsTableLogic } from "./useCommentsTableLogic";
import { getCommentColumns } from "./comment-columns";

export default function CommentsTable() {
  const {
    comments,
    toggling,
    handleFetchData,
    handleToggleVisibility,
    handleDeleteComment,
  } = useCommentsTableLogic();

  const columns = getCommentColumns(
    handleToggleVisibility,
    handleDeleteComment,
    toggling
  );

  return (
    <DataTable
      title="Comments Management"
      data={comments}
      columns={columns}
      fetchData={handleFetchData}
      filterOptions={{ dateField: "createdAt" }}
      initialPage={1}
      initialLimit={10}
    />
  );
}
