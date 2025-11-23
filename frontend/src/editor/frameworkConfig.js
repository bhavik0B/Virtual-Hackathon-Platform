export const FrameworkConfig = {
  React: {
    language: "javascript",
    apply: (monaco) => {
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        jsx: "react",
        allowJs: true,
        target: monaco.languages.typescript.ScriptTarget.Latest,
      });
    }
  },

  Node: {
    language: "javascript",
    apply: (monaco) => {
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowJs: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      });
    }
  },

  Flask: {
    language: "python",
    apply: (monaco) => {
      monaco.languages.register({ id: "python" });
    }
  },

  Django: {
    language: "python",
    apply: (monaco) => {
      monaco.languages.register({ id: "python" });
    }
  },

  FastAPI: {
    language: "python",
    apply: (monaco) => {
      monaco.languages.register({ id: "python" });
    }
  }
};