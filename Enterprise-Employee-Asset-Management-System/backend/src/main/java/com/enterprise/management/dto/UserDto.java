package com.enterprise.management.dto;

import com.enterprise.management.entity.Role;

public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private boolean active;

    public UserDto() {}

    public UserDto(Long id, String email, String fullName, Role role, boolean active) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
