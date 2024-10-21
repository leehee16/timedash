import React, { ReactNode } from 'react';

interface LayoutProps {
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ leftSidebar, mainContent, rightSidebar }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        {leftSidebar}
      </div>

      {/* Main content area */}
      <div className="flex-grow flex flex-col overflow-hidden" style={{ minWidth: '600px', maxWidth: '1200px' }}>
        <div className="h-12 bg-gray-700 text-white flex items-center px-4">
          {/* Tab bar */}
        </div>
        <div className="flex-grow overflow-auto">
          {mainContent}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-64 bg-gray-200 flex flex-col">
        {rightSidebar}
      </div>
    </div>
  );
};
