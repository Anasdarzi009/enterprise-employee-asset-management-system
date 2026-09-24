package com.enterprise.management.controller;

import com.enterprise.management.dto.ApiResponse;
import com.enterprise.management.dto.UserDto;
import com.enterprise.management.entity.Role;
import com.enterprise.management.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String roleStr = payload.get("role");
        Role newRole = Role.valueOf(roleStr.toUpperCase());
        UserDto updated = userService.updateUserRole(id, newRole);
        return ResponseEntity.ok(ApiResponse.ok("User role updated successfully.", updated));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(@PathVariable Long id) {
        UserDto updated = userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.ok("User status updated.", updated));
    }
}
