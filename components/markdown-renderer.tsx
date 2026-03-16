"use client";

import { marked } from "marked";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    async function render() {
      marked.setOptions({
        highlight: async function (code, lang) {
          try {
            return await codeToHtml(code, {
              lang: lang || "text",
              theme: "github-light",
            });
          } catch {
            return `<pre><code>${code}</code></pre>`;
          }
        },
      });

      const rendered = await marked.parse(content, { async: true });
      setHtml(rendered as string);
    }
    render();
  }, [content]);

  return (
    <div
      className="prose prose-gray max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-gray-800 prose-li:text-gray-800 prose-table:text-gray-800 prose-th:text-gray-900 prose-td:text-gray-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
