package com.eventbooking.service;

import com.eventbooking.entity.BlacklistedToken;
import com.eventbooking.repository.BlacklistedTokenRepository;
import com.eventbooking.config.DtoMapper;
import com.eventbooking.dto.LoginDTO;
import com.eventbooking.dto.LoginResponseDTO;
import com.eventbooking.dto.UserDTO;
import com.eventbooking.dto.UserResponseDTO;
import com.eventbooking.entity.Role;
import com.eventbooking.entity.User;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.InvalidCredentialsException;
import com.eventbooking.exception.UserNotFoundException;
import com.eventbooking.repository.UserRepository;
import com.eventbooking.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final BlacklistedTokenRepository blacklistRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper dtoMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsServiceWrapper userDetailsService;

    @Transactional
    public UserResponseDTO register(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (userRepository.existsByPhone(userDTO.getPhone())) {
            throw new BadRequestException("Phone number already registered");
        }

        Role role = userDTO.getRole() != null ? userDTO.getRole() : Role.USER;
        if (role == Role.ADMIN) {
            role = Role.USER;
        }

        User user = User.builder()
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .phone(userDTO.getPhone())
                .role(role)
                .build();

        User saved = userRepository.save(user);
        return dtoMapper.toUserResponse(saved);
    }

    public LoginResponseDTO login(LoginDTO loginDTO) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getEmail(), loginDTO.getPassword()));
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginDTO.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name());

        return LoginResponseDTO.builder()
                .token(token)
                .role(user.getRole())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    public UserResponseDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return dtoMapper.toUserResponse(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public String logout(String authorizationHeader) {

        String token = authorizationHeader.substring(7); // Remove "Bearer "

        blacklistRepository.save(
                BlacklistedToken.builder()
                        .token(token)
                        .expiryTime(
                                jwtUtil.extractExpiration(token)
                                        .toInstant()
                                        .atZone(java.time.ZoneId.systemDefault())
                                        .toLocalDateTime())
                        .build());

        return "Logged out successfully";
    }

}
