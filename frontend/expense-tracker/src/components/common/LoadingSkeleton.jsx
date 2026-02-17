import React from "react";

// Skeleton Pulse Animation
const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-animate ${className}`}>
  </div>
);

// Dashboard Info Cards Skeleton
export const InfoCardSkeleton = () => (
  <div className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 animate-pulse">
    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gray-200 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <SkeletonCard className="h-4 w-24 rounded" />
      <SkeletonCard className="h-6 w-32 rounded" />
    </div>
  </div>
);

// Transaction Table Skeleton
export const TransactionTableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 animate-pulse">
    {/* Header */}
    <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-b border-gray-200 flex gap-4">
      <SkeletonCard className="h-4 w-24 rounded" />
      <SkeletonCard className="h-4 w-32 rounded flex-1" />
      <SkeletonCard className="h-4 w-20 rounded" />
    </div>

    {/* Rows */}
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center gap-4">
          <SkeletonCard className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonCard className="h-4 w-32 rounded" />
            <SkeletonCard className="h-3 w-24 rounded" />
          </div>
          <SkeletonCard className="h-6 w-20 rounded-lg" />
          <SkeletonCard className="h-8 w-16 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// Finance Overview Chart Skeleton
export const ChartSkeleton = ({ height = "280px" }) => (
  <div className={`bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-300 animate-pulse`}>
    <SkeletonCard className="h-6 w-32 rounded mb-6" />
    <div className="flex justify-center">
      <div style={{ width: "280px", height: "280px" }} className="bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

// Simple Skeleton Card
export const SimpleCardSkeleton = ({ rows = 3 }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse border border-gray-100">
    <SkeletonCard className="h-6 w-40 rounded mb-6" />
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonCard key={i} className="h-4 w-full rounded" />
      ))}
    </div>
  </div>
);

// Dashboard Loading Grid
export const DashboardLoadingSkeleton = () => (
  <div className='my-5 mx-auto'>
    {/* Info Cards */}
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
      <InfoCardSkeleton />
      <InfoCardSkeleton />
      <InfoCardSkeleton />
    </div>

    {/* Charts and Tables */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <TransactionTableSkeleton rows={3} />
      <ChartSkeleton />
      <TransactionTableSkeleton rows={3} />
      <SimpleCardSkeleton rows={2} />
      <TransactionTableSkeleton rows={3} />
      <ChartSkeleton />
    </div>
  </div>
);

// List Loading Skeleton
export const ListLoadingSkeleton = ({ rows = 8 }) => (
  <div className="my-5 mx-auto max-w-7xl">
    <TransactionTableSkeleton rows={rows} />
  </div>
);
