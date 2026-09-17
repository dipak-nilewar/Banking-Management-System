package com.digital_banking_management_system.security;

import java.io.IOException;
import java.util.Locale;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7).trim();

        try {
            if (token.isBlank()) {
                response.setHeader("WWW-Authenticate", "Bearer");
                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Bearer token is required"
                );
                return;
            }

            String email = jwtService.extractEmail(token);
            System.out.println("JWT Email: " + email);

            if (email != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {
                email = email.trim().toLowerCase(Locale.ROOT);
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );
                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
                        System.out.println("JWT Authentication Successful");
System.out.println("Role: " + userDetails.getAuthorities());
            }
        }  catch (RuntimeException exception) {

    exception.printStackTrace();

    SecurityContextHolder.clearContext();

    response.setHeader("WWW-Authenticate", "Bearer");

    response.sendError(
            HttpServletResponse.SC_UNAUTHORIZED,
            "Invalid or expired bearer token"
    );

    return;
        }

        filterChain.doFilter(request, response);
    }
}
