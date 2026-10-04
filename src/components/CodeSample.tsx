import { useEffect, useState } from 'react'
import { useMessages } from '../i18n'

interface CodeSampleProps {
  code: string
}

// コピー完了表示を戻すまでの時間。短すぎると押したことに気づけない
const COPIED_RESET_MS = 1500

export function CodeSample({ code }: CodeSampleProps) {
  const m = useMessages()
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) return undefined
    const timeoutId = window.setTimeout(
      () => setIsCopied(false),
      COPIED_RESET_MS
    )
    return () => window.clearTimeout(timeoutId)
  }, [isCopied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
    } catch (error) {
      // clipboard は非 HTTPS や権限拒否で失敗する。コードは画面で選択コピーできるので表示は壊さない
      console.error('Failed to copy code sample', error)
    }
  }

  return (
    <div className="code-sample">
      <button type="button" className="code-copy" onClick={handleCopy}>
        {isCopied ? m.code.copied : m.code.copy}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
