package com.gamersup.gamersupbackend.security.config;

import com.gamersup.gamersupbackend.model.account.CustomOAuth2User;
import com.gamersup.gamersupbackend.service.account_service.CustomAuthenticationProvider;
import com.gamersup.gamersupbackend.service.account_service.CustomOAuth2UserService;
import com.gamersup.gamersupbackend.service.account_service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.client.OAuth2LoginConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
@EnableWebSecurity
//@EnableGlobalMethodSecurity(prePostEnabled = true) // for pre Authorized
@AllArgsConstructor
public class SecurityConfig {

    @Autowired
    private CustomAuthenticationProvider customAuthenticationProvider;

    @Autowired
    private CustomOAuth2UserService oauth2UserService;

    @Autowired
    private UserService userService;

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeRequests(auth -> {
                    auth.antMatchers("/**").permitAll();
                    auth.anyRequest().authenticated();
                })
                .httpBasic(Customizer.withDefaults())
                .oauth2Login(oauth2 -> {
//                    oauth2.defaultSuccessUrl("/loginSuccess");
//                    oauth2.failureUrl("/loginFailure");
                    oauth2.authorizationEndpoint()
                            .baseUri("/oauth2/authorize-client")
                            .authorizationRequestRepository(authorizationRequestRepository()); //modified the baseUri to /oauth2/authorize-google instead of the default /oauth2/authorization
//                    oauth2.redirectionEndpoint().baseUri("/login/oauth2/success/*");
//                    oauth2.failureHandler((request, response, exception) -> {
//                        request.getSession().setAttribute("error.message", exception.getMessage());
//                    });
                    oauth2.userInfoEndpoint(userinfo -> userinfo.userService(oauth2UserService));
                    oauth2.successHandler(new AuthenticationSuccessHandler() {
                        @Override
                        public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
                            userService.registerOAuthUser(oAuth2User.getName(), oAuth2User.getEmail());
                        }
                    });
                });
        return http.build();
    }

    // setting an authorizationRequestRepository() bean for the baseUri
    @Bean
    public AuthorizationRequestRepository<OAuth2AuthorizationRequest>
    authorizationRequestRepository() {

        return new HttpSessionOAuth2AuthorizationRequestRepository();
    }

    @Autowired
    public void bindAuthenticationProvider(AuthenticationManagerBuilder authenticationManagerBuilder) {
        authenticationManagerBuilder
                .authenticationProvider(customAuthenticationProvider);
    }

}
