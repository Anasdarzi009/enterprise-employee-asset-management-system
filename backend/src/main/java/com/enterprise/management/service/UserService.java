package com.enterprise.management.service;

import com.enterprise.management.dto.UserDto;
import com.enterprise.management.entity.Role;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto updateUserRole(Long userId, Role newRole);
    UserDto toggleUserStatus(Long userId);
}
