import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="pl-10 pr-4 py-2 w-full md:w-64 bg-gray-100 dark:bg-gray-800 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>
  )
}

