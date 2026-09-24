package com.enterprise.management.service;

import com.enterprise.management.dto.AuthRequest;
import com.enterprise.management.dto.AuthResponse;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse getCurrentUser();
}
