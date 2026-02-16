"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  bulkActions?: React.ReactNode;
  emptyMessage?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  filters?: React.ReactNode;
}

type SortDirection = "asc" | "desc" | null;

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = "Пошук...",
  pageSize = 10,
  onRowClick,
  actions,
  bulkActions,
  emptyMessage = "Немає даних для відображення",
  onRefresh,
  onExport,
  filters,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortKey];
      const bValue = (b as any)[sortKey];
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((item) => item.id)));
    }
  };

  // Handle select row
  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) {
      return <ChevronsUpDown className="h-4 w-4 text-zinc-600" />;
    }
    if (sortDirection === "asc") {
      return <ChevronUp className="h-4 w-4 text-amber-500" />;
    }
    return <ChevronDown className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-64 bg-zinc-800/50 border-zinc-700"
              />
            </div>
          )}
          {filters}
        </div>
        <div className="flex items-center gap-2">
          {selectedRows.size > 0 && bulkActions}
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Оновити
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Експорт
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-zinc-800">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-900"
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider ${
                      column.sortable ? "cursor-pointer select-none hover:text-zinc-200" : ""
                    }`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && <SortIcon columnKey={column.key} />}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="w-24 px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Дії
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="bg-zinc-900/30">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-4" />
                    </td>
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </td>
                    )}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 2 : 1)}
                    className="px-4 py-12 text-center text-zinc-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className={`bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${selectedRows.has(item.id) ? "bg-amber-500/5" : ""}`}
                    onClick={() => onRowClick?.(item)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-900"
                      />
                    </td>
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm text-zinc-300">
                        {column.render
                          ? column.render(item)
                          : (item as any)[column.key]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {actions(item)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-zinc-500">
            Показано {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, sortedData.length)} з {sortedData.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Status Badge Component
export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    PENDING: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Очікує" },
    ACTIVE: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Активний" },
    INACTIVE: { color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20", label: "Неактивний" },
    REJECTED: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Відхилено" },
    APPROVED: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Схвалено" },
  };

  const config = statusConfig[status] || { color: "bg-zinc-500/10 text-zinc-400", label: status };

  return (
    <Badge variant="outline" className={config.color}>
      {config.label}
    </Badge>
  );
}
