import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

export default function ResumeDropzone({ onFileSelect, file, onClear }) {
  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onFileSelect(accepted[0])
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  if (file) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 truncate">{file.name}</p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
            {(file.size / 1024).toFixed(1)} KB · PDF
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'relative flex flex-col items-center justify-center gap-3 p-6 sm:p-10 rounded-xl border-2 border-dashed cursor-pointer',
        'transition-all duration-200',
        isDragActive && !isDragReject
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
          : isDragReject
          ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
          : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
      )}
    >
      <input {...getInputProps()} />

      <div className={clsx(
        'w-14 h-14 rounded-xl flex items-center justify-center transition-colors',
        isDragActive ? 'bg-brand-100 dark:bg-brand-900/40' : 'bg-brand-50 dark:bg-slate-800'
      )}>
        {isDragActive
          ? <FileText className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          : <Upload    className="w-7 h-7 text-brand-600 dark:text-brand-400" />
        }
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {isDragReject
            ? 'Only PDF files are accepted'
            : isDragActive
            ? 'Drop your resume here'
            : 'Drop your PDF resume here'
          }
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          or <span className="text-brand-600 dark:text-brand-400 font-medium">click to browse</span> · Max 10 MB
        </p>
      </div>
    </div>
  )
}
