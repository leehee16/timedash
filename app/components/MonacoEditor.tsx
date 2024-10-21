import React from 'react';
import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ value, onChange }) => {
  return (
    <Editor
      height="calc(100vh - 40px)"
      defaultLanguage="markdown"
      value={value}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
      }}
    />
  );
};

export default MonacoEditor;
