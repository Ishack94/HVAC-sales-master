import { Link } from 'react-router-dom'
import styles from './Button.module.css'

export default function Button({ children, to, href, onClick, variant = 'primary', type = 'button', disabled }) {
  const className = `${styles.btn} ${styles[variant]}`

  if (to) {
    return <Link to={to} className={className}>{children}</Link>
  }
  if (href) {
    return <a href={href} className={className}>{children}</a>
  }
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
