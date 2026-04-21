import ButtonBase from '@mui/material/ButtonBase'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-md font-medium',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/40',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90',
        secondary:
          'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800',
        ghost: 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900',
        danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

const cx = (...classes: Array<string | undefined | null | false>): string => {
  return classes.filter(Boolean).join(' ')
}

const SpinnerIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      className={cx('h-4 w-4 animate-spin', props.className)}
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  )
}

export type HTMLButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonProps = HTMLButtonProps &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
  }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading = false, disabled, children, type = 'button', ...props },
    ref,
  ) => {
    const isDisabled = Boolean(disabled || isLoading)

    return (
      <ButtonBase
        ref={ref}
        component="button"
        type={type}
        className={cx(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? <SpinnerIcon data-testid="spinner" /> : null}
        <span className={cx(isLoading ? 'opacity-70' : undefined)}>{children}</span>
      </ButtonBase>
    )
  },
)

Button.displayName = 'Button'
