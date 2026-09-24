package com.enterprise.management.config;

import com.enterprise.management.entity.*;
import com.enterprise.management.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final AssetRepository assetRepository;
    private final AssetAssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           EmployeeRepository employeeRepository,
                           AssetRepository assetRepository,
                           AssetAssignmentRepository assignmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.assetRepository = assetRepository;
        this.assignmentRepository = assignmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data population.");
            return;
        }

        log.info("Starting initial enterprise sample data seeding...");

        // 1. Seed Users (Demo Accounts)
        User adminUser = new User("admin@company.com", passwordEncoder.encode("Admin@123"), "Executive Admin", Role.ADMIN);
        User hrUser = new User("hr@company.com", passwordEncoder.encode("Hr@123"), "Rachel Green (HR)", Role.HR);
        User empUser = new User("employee@company.com", passwordEncoder.encode("Employee@123"), "Alexander Wright", Role.EMPLOYEE);
        userRepository.saveAll(List.of(adminUser, hrUser, empUser));

        // 2. Seed Departments
        Department engDept = departmentRepository.save(new Department("Engineering", "ENG", "Software engineering, infrastructure and cloud"));
        Department hrDept = departmentRepository.save(new Department("Human Resources", "HRD", "Talent acquisition, employee relations, and payroll"));
        Department finDept = departmentRepository.save(new Department("Finance & Operations", "FIN", "Corporate finance, treasury and accounting"));
        Department prdDept = departmentRepository.save(new Department("Product & Design", "PRD", "Product strategy, UI/UX and user research"));
        Department itDept = departmentRepository.save(new Department("IT Infrastructure", "ITS", "Internal hardware, network and IT helpdesk"));

        // 3. Seed Realistic Employees
        Employee emp1 = employeeRepository.save(new Employee(
                "EMP-1001", "Alexander", "Wright", "employee@company.com", "+1 (555) 234-5678",
                engDept, "Senior Cloud Architect", LocalDate.of(2022, 3, 15), EmploymentStatus.ACTIVE
        ));

        Employee emp2 = employeeRepository.save(new Employee(
                "EMP-1002", "Sarah", "Jenkins", "s.jenkins@company.com", "+1 (555) 345-6789",
                engDept, "Lead Full-Stack Engineer", LocalDate.of(2021, 6, 1), EmploymentStatus.ACTIVE
        ));

        Employee emp3 = employeeRepository.save(new Employee(
                "EMP-1003", "David", "Miller", "d.miller@company.com", "+1 (555) 456-7890",
                prdDept, "Principal Product Designer", LocalDate.of(2022, 8, 20), EmploymentStatus.ACTIVE
        ));

        Employee emp4 = employeeRepository.save(new Employee(
                "EMP-1004", "Emily", "Chen", "hr@company.com", "+1 (555) 567-8901",
                hrDept, "HR Operations Manager", LocalDate.of(2020, 11, 10), EmploymentStatus.ACTIVE
        ));

        Employee emp5 = employeeRepository.save(new Employee(
                "EMP-1005", "Michael", "Patel", "m.patel@company.com", "+1 (555) 678-9012",
                finDept, "Senior Financial Analyst", LocalDate.of(2023, 1, 9), EmploymentStatus.ACTIVE
        ));

        Employee emp6 = employeeRepository.save(new Employee(
                "EMP-1006", "Jessica", "Taylor", "j.taylor@company.com", "+1 (555) 789-0123",
                itDept, "DevOps & Infrastructure Lead", LocalDate.of(2021, 9, 14), EmploymentStatus.ACTIVE
        ));

        Employee emp7 = employeeRepository.save(new Employee(
                "EMP-1007", "James", "Wilson", "j.wilson@company.com", "+1 (555) 890-1234",
                engDept, "Frontend Engineer", LocalDate.of(2023, 7, 3), EmploymentStatus.ACTIVE
        ));

        Employee emp8 = employeeRepository.save(new Employee(
                "EMP-1008", "Priya", "Sharma", "p.sharma@company.com", "+1 (555) 901-2345",
                itDept, "Quality Assurance Specialist", LocalDate.of(2022, 12, 1), EmploymentStatus.ON_LEAVE
        ));

        // 4. Seed Realistic Enterprise Assets
        Asset ast1 = new Asset("AST-LAP-001", "Apple MacBook Pro 16\" M3 Max", AssetType.LAPTOP, "C02G4589MD6R",
                LocalDate.of(2023, 11, 20), AssetStatus.ASSIGNED, "64GB Unified Memory, 1TB SSD, Space Black");
        ast1.setCurrentEmployee(emp1);
        assetRepository.save(ast1);

        Asset ast2 = new Asset("AST-LAP-002", "Dell XPS 15 9530", AssetType.LAPTOP, "8FK29M3",
                LocalDate.of(2023, 8, 15), AssetStatus.ASSIGNED, "i9-13900H, 32GB RAM, RTX 4070, Platinum Silver");
        ast2.setCurrentEmployee(emp2);
        assetRepository.save(ast2);

        Asset ast3 = new Asset("AST-LAP-003", "Lenovo ThinkPad X1 Carbon Gen 11", AssetType.LAPTOP, "PF429KL9",
                LocalDate.of(2024, 1, 10), AssetStatus.AVAILABLE, "Core i7, 32GB LPDDR5, 512GB SSD, Ultra-lightweight");
        assetRepository.save(ast3);

        Asset ast4 = new Asset("AST-MON-001", "Dell UltraSharp 27\" 4K USB-C Hub Monitor (U2723QE)", AssetType.MONITOR, "CN09F81274100",
                LocalDate.of(2023, 4, 12), AssetStatus.ASSIGNED, "IPS Black technology, 90W Power Delivery hub");
        ast4.setCurrentEmployee(emp1);
        assetRepository.save(ast4);

        Asset ast5 = new Asset("AST-MON-002", "Apple Studio Display 27\" 5K Retina", AssetType.MONITOR, "H73V9120M29A",
                LocalDate.of(2023, 5, 22), AssetStatus.ASSIGNED, "Tilt-adjustable stand, Nano-texture glass");
        ast5.setCurrentEmployee(emp3);
        assetRepository.save(ast5);

        Asset ast6 = new Asset("AST-MON-003", "LG 34\" UltraWide Curved Monitor (34WN80C)", AssetType.MONITOR, "304NDTM28190",
                LocalDate.of(2023, 2, 18), AssetStatus.AVAILABLE, "QHD IPS 21:9 with sRGB 99% Color Gamut");
        assetRepository.save(ast6);

        Asset ast7 = new Asset("AST-KEY-001", "Keychron Q3 Pro Wireless Mechanical Keyboard", AssetType.KEYBOARD, "KQ3P-8829-GR",
                LocalDate.of(2023, 9, 5), AssetStatus.ASSIGNED, "QMK/VIA wireless custom mechanical keyboard, Gateron Jupiter Red");
        ast7.setCurrentEmployee(emp2);
        assetRepository.save(ast7);

        Asset ast8 = new Asset("AST-MOU-001", "Logitech MX Master 3S Wireless Mouse", AssetType.MOUSE, "LZ94810237",
                LocalDate.of(2023, 9, 5), AssetStatus.ASSIGNED, "Quiet clicks, 8K DPI sensor, Pale Grey");
        ast8.setCurrentEmployee(emp2);
        assetRepository.save(ast8);

        Asset ast9 = new Asset("AST-TAB-001", "Apple iPad Pro 12.9\" M2 Wi-Fi + 5G", AssetType.TABLET, "DMPF8194KLM9",
                LocalDate.of(2023, 10, 1), AssetStatus.ASSIGNED, "256GB Space Grey with Apple Pencil 2 for design review");
        ast9.setCurrentEmployee(emp3);
        assetRepository.save(ast9);

        Asset ast10 = new Asset("AST-MOB-001", "Google Pixel 8 Pro (Test Device)", AssetType.MOBILE, "359871029384756",
                LocalDate.of(2023, 12, 1), AssetStatus.AVAILABLE, "Obsidian 128GB reserved for mobile QA testing");
        assetRepository.save(ast10);

        Asset ast11 = new Asset("AST-PRN-001", "HP Color LaserJet Enterprise MFP M480f", AssetType.PRINTER, "VNB3948102",
                LocalDate.of(2022, 5, 30), AssetStatus.MAINTENANCE, "Floor 3 Executive wing printer - undergoing roller replacement");
        assetRepository.save(ast11);

        Asset ast12 = new Asset("AST-DSK-001", "Dell Precision 7920 Tower Workstation", AssetType.DESKTOP, "DP7920-88124",
                LocalDate.of(2020, 2, 15), AssetStatus.RETIRED, "Decommissioned compute node replaced by cloud infrastructure");
        assetRepository.save(ast12);

        // 5. Seed Asset Assignments History
        // Current active assignments
        AssetAssignment asg1 = new AssetAssignment(ast1, emp1, LocalDate.of(2023, 11, 22), "Primary development workstation for cloud architecture.", adminUser);
        AssetAssignment asg2 = new AssetAssignment(ast2, emp2, LocalDate.of(2023, 8, 18), "Assigned upon joining engineering core team.", hrUser);
        AssetAssignment asg3 = new AssetAssignment(ast4, emp1, LocalDate.of(2023, 11, 22), "External dual-monitor workstation setup.", adminUser);
        AssetAssignment asg4 = new AssetAssignment(ast5, emp3, LocalDate.of(2023, 5, 25), "High-gamut color calibrated screen for product design.", hrUser);
        AssetAssignment asg5 = new AssetAssignment(ast7, emp2, LocalDate.of(2023, 9, 10), "Ergonomic peripheral request.", hrUser);
        AssetAssignment asg6 = new AssetAssignment(ast8, emp2, LocalDate.of(2023, 9, 10), "Ergonomic peripheral request.", hrUser);
        AssetAssignment asg7 = new AssetAssignment(ast9, emp3, LocalDate.of(2023, 10, 5), "UI tablet for sketching design systems and mockups.", adminUser);

        // Historical returned assignment
        AssetAssignment asgOld = new AssetAssignment(ast3, emp5, LocalDate.of(2023, 1, 15), "Temporary laptop during probation period.", hrUser);
        asgOld.setReturnedDate(LocalDate.of(2023, 12, 20));
        asgOld.setStatus(AssignmentStatus.RETURNED);
        asgOld.setNotes("Temporary laptop during probation period. [Return notes: Returned in pristine condition after permanent desktop setup]");

        assignmentRepository.saveAll(List.of(asg1, asg2, asg3, asg4, asg5, asg6, asg7, asgOld));

        log.info("Enterprise sample data successfully seeded!");
    }
}
