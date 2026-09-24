package com.enterprise.management.service.impl;

import com.enterprise.management.dto.AuthRequest;
import com.enterprise.management.dto.AuthResponse;
import com.enterprise.management.entity.User;
import com.enterprise.management.exception.BadRequestException;
import com.enterprise.management.repository.UserRepository;
import com.enterprise.management.security.JwtUtils;
import com.enterprise.management.security.UserDetailsImpl;
import com.enterprise.management.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userPrincipal);

        User user = userRepository.findByEmail(userPrincipal.getUsername())
                .orElseThrow(() -> new BadRequestException("User record not found"));

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }

    @Override
    public AuthResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl userPrincipal)) {
            throw new BadRequestException("No authenticated user in context");
        }

        User user = userRepository.findByEmail(userPrincipal.getUsername())
                .orElseThrow(() -> new BadRequestException("User record not found"));

        return new AuthResponse(
                null,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }
}
