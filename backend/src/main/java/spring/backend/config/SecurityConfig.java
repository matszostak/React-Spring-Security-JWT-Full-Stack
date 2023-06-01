package spring.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final String ROLE_ADMIN = "ROLE_ADMIN";
    private final String ROLE_EMPLOYEE = "ROLE_EMPLOYEE";
    private final String ROLE_USER = "ROLE_USER";


    private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;
    private final UserAuthenticationProvider userAuthenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .exceptionHandling().authenticationEntryPoint(userAuthenticationEntryPoint)
                .and()
                .addFilterBefore(new JwtAuthFilter(userAuthenticationProvider), BasicAuthenticationFilter.class)
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(HttpMethod.POST, "/login", "/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/wines/**", "/api/wines", "/api/randomwines").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/wines/**", "/api/wines").hasAnyAuthority(ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_USER)
                        .requestMatchers(HttpMethod.GET, "/api/users/**", "/api/users").hasAuthority(ROLE_ADMIN)
                        .requestMatchers("/api/orders/**", "/api/orders").hasAnyAuthority(ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_USER)
                        .requestMatchers( "/api/employees/**", "/api/employees").hasAuthority(ROLE_ADMIN)

                        .anyRequest().denyAll()) //TODO: set access for different authorities
        ;
        return http.build();
    }
}