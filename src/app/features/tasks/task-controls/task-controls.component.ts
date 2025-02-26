import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task.model';

// Import Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './task-controls.component.html',
  styleUrl: './task-controls.component.scss',
})
export class TaskControlsComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  @Output() filteredTasksChange = new EventEmitter<Task[]>();

  filterStatus: string = 'all';
  dateSortOrder: string = 'newest';
  prioritySortOrder: string = 'priority-high';
  searchQuery: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.applyAllFilters();
    }
  }

  onFilterChanged(): void {
    this.applyAllFilters();
  }

  private applyAllFilters(): void {
    let result = [...this.tasks];
    result = this.filterTasks(result);
    result = this.sortByPriority(result);
    result = this.sortByDate(result);
    result = this.pinTasksFirst(result);
    this.filteredTasksChange.emit(result);
  }

  private filterTasks(list: Task[]): Task[] {
    return list.filter((task) => {
      const matchesStatus =
        this.filterStatus === 'all' ||
        (this.filterStatus === 'completed' && task.completed) ||
        (this.filterStatus === 'incomplete' && !task.completed) ||
        (this.filterStatus === 'overdue' && this.isOverdue(task));

      const matchesSearch = this.searchQuery
        ? task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (task.description &&
            task.description
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()))
        : true;

      return matchesStatus && matchesSearch;
    });
  }

  private sortByPriority(list: Task[]): Task[] {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    if (this.prioritySortOrder === 'priority-high') {
      return list.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else {
      return list.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    }
  }

  private sortByDate(list: Task[]): Task[] {
    if (this.dateSortOrder === 'newest') {
      return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (this.dateSortOrder === 'oldest') {
      return list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
    return list;
  }

  private pinTasksFirst(list: Task[]): Task[] {
    return list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  }

  private isOverdue(task: Task): boolean {
    return task.deadline
      ? new Date(task.deadline) < new Date() && !task.completed
      : false;
  }
}
