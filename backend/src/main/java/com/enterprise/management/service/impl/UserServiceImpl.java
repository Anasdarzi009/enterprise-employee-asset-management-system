package com.enterprise.management.service.impl;

import com.enterprise.management.dto.UserDto;
import com.enterprise.management.entity.Role;
import com.enterprise.management.entity.User;
import com.enterprise.management.exception.ResourceNotFoundException;
import com.enterprise.management.repository.UserRepository;
import com.enterprise.management.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserDto(u.getId(), u.getEmail(), u.getFullName(), u.getRole(), u.isActive()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setRole(newRole);
        User saved = userRepository.save(user);
        return new UserDto(saved.getId(), saved.getEmail(), saved.getFullName(), saved.getRole(), saved.isActive());
    }

    @Override
    @Transactional
    public UserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setActive(!user.isActive());
        User saved = userRepository.save(user);
        return new UserDto(saved.getId(), saved.getEmail(), saved.getFullName(), saved.getRole(), saved.isActive());
    }
}
