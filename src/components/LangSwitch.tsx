import { LANG_LABELS, LANGS, useMessages, type Lang } from '../i18n'

interface LangSwitchProps {
  lang: Lang
  onChange: (value: Lang) => void
}

export function LangSwitch({ lang, onChange }: LangSwitchProps) {
  const m = useMessages()
  return (
    <div className="radio-group lang-switch" aria-label={m.languageLabel}>
      {LANGS.map((value) => (
        <span key={value}>
          <input
            type="radio"
            name="lang"
            id={`lang-${value}`}
            value={value}
            checked={lang === value}
            onChange={() => onChange(value)}
          />
          <label htmlFor={`lang-${value}`} lang={value}>
            {LANG_LABELS[value]}
          </label>
        </span>
      ))}
    </div>
  )
}
