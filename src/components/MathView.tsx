import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  displayMode = false,
  className = '',
}) => {
  const html = useMemo(() => {
    if (!math) return '';

    try {
      let latex = math.trim();

      // If string does not contain proper LaTeX commands, convert simple plain text notation
      if (!latex.includes('\\log') && !latex.includes('\\frac')) {
        latex = latex
          .replace(/\^\{?(\d+|[a-zA-Z]+|\\[a-zA-Z]+)\}?log/gi, '{}^{$1}\\!\\log ')
          .replace(/\blog\b/gi, '\\log ')
          .replace(/×/g, ' \\times ')
          .replace(/·/g, ' \\cdot ')
          .replace(/=\s*\.\.\./g, '= \\dots');
      }

      // output: 'html' ensures ONLY HTML is rendered, completely eliminating duplicate MathML plain-text
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return math;
    }
  }, [math, displayMode]);

  return (
    <span
      className={`inline-math-equation select-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
