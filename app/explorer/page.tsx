'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, FileJson } from 'lucide-react';
import { prosuiteData } from '@/lib/prosuite-data';
import AppLayout from '@/components/AppLayout';

export default function ExplorerPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const modules = [
    { id: 'all', name: 'All Modules' },
    { id: 'core', name: 'Core System' },
    { id: 'risk', name: 'Risk Management' },
    { id: 'asset', name: 'Asset Management' },
    { id: 'incident', name: 'Incident Management' },
    { id: 'audit', name: 'Audit Management' },
    { id: 'compliance', name: 'Compliance Management' },
    { id: 'governance', name: 'Governance' },
  ];

  const getModuleData = () => {
    if (selectedModule === 'all') {
      return Object.entries(prosuiteData).filter(([key]) => key !== 'metadata');
    }
    return [[selectedModule, (prosuiteData as any)[selectedModule]]];
  };

  const renderValue = (value: any): JSX.Element => {
    if (value === null) return <span className="text-gray-400">null</span>;
    if (value === undefined) return <span className="text-gray-400">undefined</span>;
    if (typeof value === 'boolean') return <span className="text-purple-600">{value.toString()}</span>;
    if (typeof value === 'number') return <span className="text-blue-600">{value}</span>;
    if (typeof value === 'string') return <span className="text-green-600">"{value}"</span>;
    
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400">[]</span>;
      return <span className="text-gray-600">[{value.length} items]</span>;
    }
    
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return <span className="text-gray-400">{'{}'}</span>;
      return <span className="text-gray-600">{`{${keys.length} properties}`}</span>;
    }
    
    return <span>{String(value)}</span>;
  };

  const renderObject = (obj: any, path = '', depth = 0): JSX.Element[] => {
    if (depth > 3) return [];

    return Object.entries(obj).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      const isExpanded = expandedSections[currentPath];
      const isExpandable = (typeof value === 'object' && value !== null) && 
                          (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0);

      if (searchTerm && !currentPath.toLowerCase().includes(searchTerm.toLowerCase()) &&
          JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase()) === false) {
        return null;
      }

      return (
        <div key={currentPath} className="ml-4">
          <div className="flex items-start space-x-2 py-1 hover:bg-gray-50 rounded">
            {isExpandable && (
              <button
                onClick={() => toggleSection(currentPath)}
                className="flex-shrink-0 mt-1"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            {!isExpandable && <div className="w-4" />}
            
            <div className="flex-1 font-mono text-sm">
              <span className="text-gray-700 font-semibold">{key}:</span>{' '}
              {!isExpanded && renderValue(value)}
              
              {isExpanded && Array.isArray(value) && (
                <div className="mt-1">
                  {value.map((item, index) => (
                    <div key={index} className="ml-4 border-l-2 border-gray-200 pl-2 my-1">
                      <span className="text-gray-500">[{index}]</span>
                      {typeof item === 'object' && item !== null ? (
                        renderObject(item, `${currentPath}[${index}]`, depth + 1)
                      ) : (
                        <span className="ml-2">{renderValue(item)}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {isExpanded && !Array.isArray(value) && typeof value === 'object' && value !== null && (
                <div className="mt-1">
                  {renderObject(value, currentPath, depth + 1)}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }).filter(Boolean) as JSX.Element[];
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <FileJson className="w-5 h-5 text-prosuite-600" />
            <h2 className="text-lg font-semibold text-gray-900">Data Explorer</h2>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-prosuite-500 w-full md:w-64"
              />
            </div>
            
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-prosuite-500"
            >
              {modules.map(module => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Display */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="max-h-[600px] overflow-y-auto">
          {getModuleData().map(([moduleKey, moduleData]) => (
            <div key={moduleKey} className="mb-6">
              <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 capitalize">{moduleKey}</h3>
                <span className="text-xs text-gray-500">
                  {typeof moduleData === 'object' && moduleData !== null 
                    ? `${Object.keys(moduleData).length} sections`
                    : ''}
                </span>
              </div>
              {typeof moduleData === 'object' && moduleData !== null ? (
                renderObject(moduleData, moduleKey, 0)
              ) : (
                <div className="ml-4 text-sm text-gray-600">{renderValue(moduleData)}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-2xl font-bold text-prosuite-600">{prosuiteData.core?.modules?.length || 0}</p>
          <p className="text-sm text-gray-600">Modules</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-2xl font-bold text-prosuite-600">{prosuiteData.core?.users?.length || 0}</p>
          <p className="text-sm text-gray-600">Users</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-2xl font-bold text-prosuite-600">{prosuiteData.core?.departments?.length || 0}</p>
          <p className="text-sm text-gray-600">Departments</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-2xl font-bold text-prosuite-600">
            {Object.keys(prosuiteData).filter(k => k !== 'metadata').length}
          </p>
          <p className="text-sm text-gray-600">Data Sections</p>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}
