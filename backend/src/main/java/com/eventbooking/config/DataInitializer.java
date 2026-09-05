package com.eventbooking.config;

import com.eventbooking.entity.Role;
import com.eventbooking.entity.User;
import com.eventbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.countByRole(Role.ADMIN) == 0) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@eventbooking.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9999999999")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user created: admin@eventbooking.com");
        }
    }
}
