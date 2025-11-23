export const FRAMEWORKS = {
  "React": {
    language: "javascript"
  },

  "Flask": {
    language: "python"
  },

  "Django": {
    language: "python"
  },

  "FastAPI": {
    language: "python"
  },

  "Node": {
    language: "javascript"
  }
};

// This is the MAIN function your editor calls
export const applyFramework = async ({
  fwName,
  editorRef,
}) => {

  const fw = FRAMEWORKS[fwName];
  if (!fw) return;

  const { configure } = fw;

  // Configure Monaco editor
  if (editorRef.current && window.monaco) {
    configure(window.monaco);
  }
};