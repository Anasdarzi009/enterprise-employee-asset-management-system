package com.enterprise.management.service;

import com.enterprise.management.dto.EmployeeDto;
import com.enterprise.management.entity.EmploymentStatus;

import java.util.List;

public interface EmployeeService {
    List<EmployeeDto> getAllEmployees(String query, Long departmentId, EmploymentStatus status);
    EmployeeDto getEmployeeById(Long id);
    EmployeeDto getEmployeeByCode(String employeeId);
    EmployeeDto createEmployee(EmployeeDto dto);
    EmployeeDto updateEmployee(Long id, EmployeeDto dto);
    void deleteEmployee(Long id);
    List<com.enterprise.management.dto.DepartmentDto> getAllDepartments();
}
