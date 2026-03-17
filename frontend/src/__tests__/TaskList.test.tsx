import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from '../components/TaskList';
import type { Task } from '../types/Task';

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Test Task 1',
    description: 'Description 1',
    completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Test Task 2',
    description: null,
    completed: false,
    created_at: new Date().toISOString()
  }
];

describe('TaskList Component', () => {
  it('renders tasks correctly', () => {
    render(<TaskList tasks={mockTasks} onComplete={vi.fn()} />);
    
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('calls onComplete when Done button is clicked', () => {
    const onComplete = vi.fn();
    render(<TaskList tasks={mockTasks} onComplete={onComplete} />);
    
    const doneButtons = screen.getAllByText('Done');
    fireEvent.click(doneButtons[0]);
    
    expect(onComplete).toHaveBeenCalledWith(1);
  });

  it('renders empty state when no tasks', () => {
    render(<TaskList tasks={[]} onComplete={vi.fn()} />);
    
    expect(screen.getByText(/No pending tasks/i)).toBeInTheDocument();
  });
});
