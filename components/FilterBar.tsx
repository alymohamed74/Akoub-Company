
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

interface FilterBarProps {
  searchPlaceholder: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: { label: string; value: string }[];
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  className = ""
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 ${className}`}>
      <div className="flex-grow relative">
        <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
        />
      </div>
      
      {statusOptions && onStatusChange && (
        <div className="min-w-[180px]">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none cursor-pointer font-bold text-gray-700"
          >
            <option value="all">{t('allStatus') || 'كل الحالات'}</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
