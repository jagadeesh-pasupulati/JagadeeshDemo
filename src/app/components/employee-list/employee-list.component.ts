import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  currentEmployee: Employee = {
    firstName: '',
    lastName: '',
    emailId: ''
  };
  isEditMode: boolean = false;
  editingEmployeeId: number | null = null;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        this.showMessage('Error loading employees', 'error');
        console.error('Error loading employees:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.editingEmployeeId) {
      this.updateEmployee();
    } else {
      this.createEmployee();
    }
  }

  createEmployee(): void {
    this.employeeService.createEmployee(this.currentEmployee).subscribe({
      next: (data) => {
        this.showMessage('Employee created successfully!', 'success');
        this.resetForm();
        this.loadEmployees();
      },
      error: (error) => {
        this.showMessage('Error creating employee', 'error');
        console.error('Error creating employee:', error);
      }
    });
  }

  updateEmployee(): void {
    if (this.editingEmployeeId) {
      this.employeeService.updateEmployee(this.editingEmployeeId, this.currentEmployee).subscribe({
        next: (data) => {
          this.showMessage('Employee updated successfully!', 'success');
          this.resetForm();
          this.loadEmployees();
        },
        error: (error) => {
          this.showMessage('Error updating employee', 'error');
          console.error('Error updating employee:', error);
        }
      });
    }
  }

  editEmployee(employee: Employee): void {
    this.currentEmployee = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      emailId: employee.emailId
    };
    this.isEditMode = true;
    this.editingEmployeeId = employee.id || null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteEmployee(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.showMessage('Employee deleted successfully!', 'success');
          this.loadEmployees();
        },
        error: (error) => {
          this.showMessage('Error deleting employee', 'error');
          console.error('Error deleting employee:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.currentEmployee = {
      firstName: '',
      lastName: '',
      emailId: ''
    };
    this.isEditMode = false;
    this.editingEmployeeId = null;
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}

