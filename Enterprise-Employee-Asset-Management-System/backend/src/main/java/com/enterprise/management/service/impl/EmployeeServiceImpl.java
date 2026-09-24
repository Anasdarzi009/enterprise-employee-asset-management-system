package com.enterprise.management.service.impl;

import com.enterprise.management.dto.DepartmentDto;
import com.enterprise.management.dto.EmployeeDto;
import com.enterprise.management.entity.Department;
import com.enterprise.management.entity.Employee;
import com.enterprise.management.entity.EmploymentStatus;
import com.enterprise.management.exception.BadRequestException;
import com.enterprise.management.exception.ResourceNotFoundException;
import com.enterprise.management.repository.AssetRepository;
import com.enterprise.management.repository.DepartmentRepository;
import com.enterprise.management.repository.EmployeeRepository;
import com.enterprise.management.service.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AssetRepository assetRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               DepartmentRepository departmentRepository,
                               AssetRepository assetRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.assetRepository = assetRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees(String query, Long departmentId, EmploymentStatus status) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        List<Employee> employees = employeeRepository.searchEmployees(cleanQuery, departmentId, status);
        return employees.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapToDto(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeByCode(String employeeId) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));
        return mapToDto(employee);
    }

    @Override
    @Transactional
    public EmployeeDto createEmployee(EmployeeDto dto) {
        if (employeeRepository.existsByEmployeeId(dto.getEmployeeId())) {
            throw new BadRequestException("Employee ID '" + dto.getEmployeeId() + "' already exists");
        }
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email '" + dto.getEmail() + "' is already in use");
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));

        Employee employee = new Employee();
        employee.setEmployeeId(dto.getEmployeeId().toUpperCase().trim());
        employee.setFirstName(dto.getFirstName().trim());
        employee.setLastName(dto.getLastName().trim());
        employee.setEmail(dto.getEmail().toLowerCase().trim());
        employee.setPhone(dto.getPhone());
        employee.setDepartment(department);
        employee.setDesignation(dto.getDesignation().trim());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setStatus(dto.getStatus() != null ? dto.getStatus() : EmploymentStatus.ACTIVE);

        Employee saved = employeeRepository.save(employee);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public EmployeeDto updateEmployee(Long id, EmployeeDto dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        if (!employee.getEmployeeId().equalsIgnoreCase(dto.getEmployeeId()) &&
                employeeRepository.existsByEmployeeId(dto.getEmployeeId())) {
            throw new BadRequestException("Employee ID '" + dto.getEmployeeId() + "' already exists");
        }

        if (!employee.getEmail().equalsIgnoreCase(dto.getEmail()) &&
                employeeRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email '" + dto.getEmail() + "' is already in use");
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));

        employee.setEmployeeId(dto.getEmployeeId().toUpperCase().trim());
        employee.setFirstName(dto.getFirstName().trim());
        employee.setLastName(dto.getLastName().trim());
        employee.setEmail(dto.getEmail().toLowerCase().trim());
        employee.setPhone(dto.getPhone());
        employee.setDepartment(department);
        employee.setDesignation(dto.getDesignation().trim());
        employee.setJoiningDate(dto.getJoiningDate());
        if (dto.getStatus() != null) {
            employee.setStatus(dto.getStatus());
        }

        Employee updated = employeeRepository.save(employee);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        int assignedCount = assetRepository.findByCurrentEmployeeId(id).size();
        if (assignedCount > 0) {
            throw new BadRequestException("Cannot delete employee with " + assignedCount + " active assigned assets. Return assets first.");
        }

        employeeRepository.delete(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream().map(dept -> {
            DepartmentDto d = new DepartmentDto(dept.getId(), dept.getName(), dept.getCode(), dept.getDescription());
            d.setEmployeeCount(employeeRepository.findByDepartmentId(dept.getId()).size());
            return d;
        }).collect(Collectors.toList());
    }

    private EmployeeDto mapToDto(Employee e) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(e.getId());
        dto.setEmployeeId(e.getEmployeeId());
        dto.setFirstName(e.getFirstName());
        dto.setLastName(e.getLastName());
        dto.setEmail(e.getEmail());
        dto.setPhone(e.getPhone());
        if (e.getDepartment() != null) {
            dto.setDepartmentId(e.getDepartment().getId());
            dto.setDepartmentName(e.getDepartment().getName());
            dto.setDepartmentCode(e.getDepartment().getCode());
        }
        dto.setDesignation(e.getDesignation());
        dto.setJoiningDate(e.getJoiningDate());
        dto.setStatus(e.getStatus());
        dto.setAssignedAssetsCount(assetRepository.findByCurrentEmployeeId(e.getId()).size());
        return dto;
    }
}
