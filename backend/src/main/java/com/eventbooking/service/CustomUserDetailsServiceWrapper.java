package com.eventbooking.service;

import com.eventbooking.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomUserDetailsServiceWrapper {

    private final CustomUserDetailsService customUserDetailsService;

    public UserDetails loadUserByUsername(String email) {
        return customUserDetailsService.loadUserByUsername(email);
    }
}
