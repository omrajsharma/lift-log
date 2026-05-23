export default function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-500 dark:focus:ring-neutral-800 ${className}`}
        {...props}
      />
    </label>
  )
}
