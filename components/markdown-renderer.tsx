"use client";

import { marked } from "marked";
import { useEffect, useRef } from "react";
import { codeToHtml } from "shiki";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let isCancelled = false;

    async function render() {
      if (isCancelled) return;

      // 1. 先用 marked 渲染基本 HTML
      const html = marked.parse(content) as string;
      container.innerHTML = html;

      // 2. 查找所有代码块进行后续处理
      const allPres = container.querySelectorAll("pre");

      for (const pre of Array.from(allPres)) {
        if (isCancelled) return;

        const codeElement = pre.querySelector("code");
        if (!codeElement) continue;

        // 获取语言类型
        let lang = "text";
        const classAttr = codeElement.className;
        const langMatch = classAttr.match(/language-(\w+)/);
        if (langMatch) {
          lang = langMatch[1];
        }

        const codeText = codeElement.textContent || "";

        if (lang === "mermaid") {
          // 渲染 Mermaid 图表
          try {
            const mermaid = await import("mermaid");

            // 确保 mermaid 只初始化一次
            if (!(window as any).__mermaidInit) {
              mermaid.default.initialize({
                startOnLoad: false,
                theme: "default",
                securityLevel: "loose",
                suppressErrorRendering: false,
              });
              (window as any).__mermaidInit = true;
            }

            const chartId = "m-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
            const result = await mermaid.default.render(chartId, codeText);

            const svgDiv = document.createElement("div");
            svgDiv.innerHTML = result.svg;
            svgDiv.style.margin = "1.5rem 0";
            svgDiv.style.display = "flex";
            svgDiv.style.justifyContent = "center";

            pre.parentNode?.replaceChild(svgDiv, pre);
          } catch (err) {
            console.error("Mermaid 渲染错误:", err);
            const errorDiv = document.createElement("div");
            errorDiv.style.padding = "1rem";
            errorDiv.style.backgroundColor = "#fef2f2";
            errorDiv.style.border = "1px solid #fecaca";
            errorDiv.style.borderRadius = "0.5rem";
            errorDiv.style.color = "#dc2626";
            errorDiv.innerHTML = `<strong>Mermaid 渲染失败</strong><pre style="margin-top:0.5rem;white-space:pre-wrap;">${escapeHtml(String(err))}\n\n${escapeHtml(codeText)}</pre>`;
            pre.parentNode?.replaceChild(errorDiv, pre);
          }
        } else {
          // 代码高亮
          try {
            const highlightedHtml = await codeToHtml(codeText, {
              lang: lang,
              theme: "github-light",
            });
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = highlightedHtml;
            if (tempDiv.firstElementChild) {
              pre.parentNode?.replaceChild(tempDiv.firstElementChild, pre);
            }
          } catch (err) {
            console.error("Shiki 错误:", err);
            // 如果高亮失败，保持原样
          }
        }
      }
    }

    render();

    return () => {
      isCancelled = true;
    };
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="prose prose-gray max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-gray-800 prose-li:text-gray-800 prose-table:text-gray-800 prose-th:text-gray-900 prose-td:text-gray-800"
    />
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
