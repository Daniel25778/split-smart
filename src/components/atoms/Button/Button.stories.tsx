import { Button } from './Button'

const _meta = {
  title: 'Atoms/Button',
  component: Button,
  args: {
    children: 'Button',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export const Primary = { args: { variant: 'primary' } }
export const Secondary = { args: { variant: 'secondary' } }
export const Ghost = { args: { variant: 'ghost' } }
export const Danger = { args: { variant: 'danger' } }

export const SizeSm = { args: { size: 'sm' } }
export const SizeMd = { args: { size: 'md' } }
export const SizeLg = { args: { size: 'lg' } }
