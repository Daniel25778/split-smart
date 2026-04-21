import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies correct variant class', () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByRole('button', { name: /delete/i }).className).toContain('bg-red-600')
  })

  it('shows spinner and is disabled when isLoading is true', () => {
    render(<Button isLoading>Saving</Button>)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('calls onClick handler when clicked and not disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)

    await user.click(screen.getByRole('button', { name: /go/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    )

    fireEvent.click(screen.getByRole('button', { name: /go/i }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
