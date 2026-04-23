package com.smartcampus.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/error", "/login/**", "/oauth2/**").permitAll()
                
                // Member 4: Role-Based Access Control (RBAC) Rules
                
                // User Management (Admin only)
                .requestMatchers("/api/users", "/api/users/**").hasAuthority("ROLE_ADMIN")
                
                // Resource Management
                .requestMatchers(HttpMethod.GET, "/api/resources/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/resources/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/resources/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/resources/**").hasAuthority("ROLE_ADMIN")
                
                // Booking Management
                .requestMatchers(HttpMethod.GET, "/api/bookings").hasAuthority("ROLE_ADMIN") // Global view
                .requestMatchers(HttpMethod.GET, "/api/bookings/user/**").authenticated() // Own bookings
                .requestMatchers(HttpMethod.PUT, "/api/bookings/*/status").hasAuthority("ROLE_ADMIN")
                
                // Ticket Management
                .requestMatchers(HttpMethod.GET, "/api/tickets").hasAnyAuthority("ROLE_ADMIN", "ROLE_TECHNICIAN")
                .requestMatchers(HttpMethod.GET, "/api/tickets/technician/*").hasAnyAuthority("ROLE_ADMIN", "ROLE_TECHNICIAN")
                .requestMatchers(HttpMethod.PUT, "/api/tickets/*/assign/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/tickets/*/status").hasAnyAuthority("ROLE_ADMIN", "ROLE_TECHNICIAN")

                // Favorite Tickets logic (Restrict to Technician as per recent requirements)
                .requestMatchers("/api/tickets/*/favorite").hasAuthority("ROLE_TECHNICIAN")
                .requestMatchers("/api/tickets/favorites").hasAuthority("ROLE_TECHNICIAN")

                // Analytics
                .requestMatchers("/api/analytics/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_TECHNICIAN")
                
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2LoginSuccessHandler)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
