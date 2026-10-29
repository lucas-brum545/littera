package com.littera.api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/**", "/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**", "/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/**", "/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/livros/**", "/livros/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/livros/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/livros/**", "/livros/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/livros/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/livros/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/revistas/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/revistas/**", "/revistas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/revistas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/emprestimos/**", "/emprestimos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/emprestimos/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/emprestimos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/emprestimos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/reservas/**", "/reservas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reservas/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/reservas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/reservas/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/reservas/**").permitAll()
                        .requestMatchers("/api/admin/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}