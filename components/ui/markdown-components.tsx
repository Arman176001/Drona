export interface MarkdownComponentProps {
  children?: React.ReactNode
  className?: string
  href?: string
  src?: string
  alt?: string
  node?: any
}

export const markdownComponents = {
  h1: ({ children }: MarkdownComponentProps) => (
    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
      {children}
    </h1>
  ),
  h2: ({ children }: MarkdownComponentProps) => (
    <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mt-8 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }: MarkdownComponentProps) => (
    <h3 className="text-2xl font-medium text-gray-600 dark:text-gray-300 mt-6 mb-3">
      {children}
    </h3>
  ),
  h4: ({ children }: MarkdownComponentProps) => (
    <h4 className="text-xl font-medium text-gray-600 dark:text-gray-300 mt-4 mb-2">
      {children}
    </h4>
  ),
  blockquote: ({ children }: MarkdownComponentProps) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-4 italic text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-r-md">
      {children}
    </blockquote>
  ),
  ul: ({ children }: MarkdownComponentProps) => (
    <ul className="list-disc pl-6 text-lg my-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }: MarkdownComponentProps) => (
    <ol className="list-decimal pl-6 text-lg my-4 space-y-2">{children}</ol>
  ),
  li: ({ children }: MarkdownComponentProps) => (
    <li className="text-lg text-gray-700 dark:text-gray-300">{children}</li>
  ),
  table: ({ children }: MarkdownComponentProps) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-md">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: MarkdownComponentProps) => (
    <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
  ),
  th: ({ children }: MarkdownComponentProps) => (
    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: MarkdownComponentProps) => (
    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
      {children}
    </td>
  ),
  a: ({ href, children }: MarkdownComponentProps) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }: MarkdownComponentProps) => (
    <img
      src={src || "/placeholder.svg"}
      alt={alt || ""}
      className="max-w-full h-auto rounded-lg my-4 mx-auto shadow-md"
      loading="lazy"
    />
  ),
  code: ({ className, children }: MarkdownComponentProps) => {
    const match = /language-(\w+)/.exec(className || "")
    return match ? (
      <div className="my-4 rounded-lg overflow-hidden shadow-md">
        <div className="bg-gray-800 text-gray-200 text-xs px-4 py-1 flex items-center">
          <span>{match[1]}</span>
        </div>
        <pre className="p-4 bg-gray-900 text-white overflow-auto">
          <code className={className}>{children}</code>
        </pre>
      </div>
    ) : (
      <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded font-mono text-sm">
        {children}
      </code>
    )
  },
  p: ({ children, node }: MarkdownComponentProps) => {
    if (node?.children[0]?.type === "element" && node.children[0].tagName === "span") {
      return <span>{children}</span>
    }
    return (
      <p className="text-lg text-gray-700 dark:text-gray-300 my-4 leading-relaxed">
        {children}
      </p>
    )
  },
  hr: () => <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />,
}