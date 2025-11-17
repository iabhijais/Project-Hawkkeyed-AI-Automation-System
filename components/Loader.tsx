export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-amber-500 mb-4"></div>
      <p className="text-gray-400">Processing workflow...</p>
    </div>
  )
}
