import React from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('./MonacoEditor'), { ssr: false });

interface Document {
  id: string;
  title: string;
  content: any;
}

interface DocumentTabsProps {
  documents: Document[];
  activeDocumentId: string;
  onSelectDocument: (id: string) => void;
  onCloseDocument: (id: string) => void;
  onUpdateDocument: (id: string, content: string) => void;
}

export const DocumentTabs: React.FC<DocumentTabsProps> = ({
  documents,
  activeDocumentId,
  onSelectDocument,
  onCloseDocument,
  onUpdateDocument,
}) => {
  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex bg-gray-800 text-white">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`flex items-center px-4 py-2 cursor-pointer ${
              doc.id === activeDocumentId ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
            onClick={() => onSelectDocument(doc.id)}
          >
            <span className="mr-2">{doc.title}</span>
            <button
              className="text-gray-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onCloseDocument(doc.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {activeDocument && activeDocument.content.type === 'markdown' && (
        <MonacoEditor
          value={activeDocument.content.content}
          onChange={(value) => onUpdateDocument(activeDocument.id, value || '')}
        />
      )}
    </div>
  );
};
