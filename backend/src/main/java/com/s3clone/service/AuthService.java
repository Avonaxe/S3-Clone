package com.s3clone.service;

import com.s3clone.dto.AuthResponse;
import com.s3clone.dto.RegisterResponse;
import com.s3clone.entity.User;
import com.s3clone.exception.ResourceConflictException;
import com.s3clone.repository.UserRepository;
import com.s3clone.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public RegisterResponse register(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new ResourceConflictException("Username already exists: " + username);
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        User saved = userRepository.save(user);

        RegisterResponse response = new RegisterResponse();
        response.setId(saved.getId());
        response.setUsername(saved.getUsername());
        response.setCreatedAt(saved.getCreatedAt());
        return response;
    }

    public AuthResponse login(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        String token = jwtUtil.generateToken(username);
        return new AuthResponse(token);
    }

}
