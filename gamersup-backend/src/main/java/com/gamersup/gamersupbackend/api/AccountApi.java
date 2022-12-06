package com.gamersup.gamersupbackend.api;

import com.gamersup.gamersupbackend.model.*;
import com.gamersup.gamersupbackend.model.account.RegistrationRequest;
import com.gamersup.gamersupbackend.model.account.User;
import com.gamersup.gamersupbackend.security.jwt.model.AuthenticationResponse;


import com.gamersup.gamersupbackend.service.*;
import com.gamersup.gamersupbackend.service.account_service.CustomAuthenticationProvider;
import com.gamersup.gamersupbackend.service.account_service.CustomUserDetailsService;
import com.gamersup.gamersupbackend.service.account_service.UserService;
import com.gamersup.gamersupbackend.service.account_service.RegistrationService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("api/account")
@AllArgsConstructor
@CrossOrigin(origins="http://localhost:4200")
public class AccountApi {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomAuthenticationProvider customAuthenticationProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    private final UserService service;
    private final RegistrationService registrationService;
    private final ResetPasswordService resetPasswordService;

    @PostMapping("/create")
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        return new ResponseEntity<User>(service.saveUser(user), HttpStatus.CREATED);
    }

    @PostMapping("/registration")
    public String register(@RequestBody RegistrationRequest request) {
        return registrationService.register(request);
    }

    @GetMapping(path = "/confirm")
    public boolean confirm(@RequestParam("token") String token) {
        boolean result =  registrationService.confirmToken(token);
//        return new RedirectView("http://localhost:4200/login");
        return result;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody GamerLoginRequest request) throws Exception {
        try {
            customAuthenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),
                    request.getPassword()));
        } catch (BadCredentialsException ex) {
            throw new Exception("Incorrect email or password", ex);
        }

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getEmail());
//        final String jwt = jwtUsernameAndPasswordAuthenticationFilter.generateToken(userDetails);
        String jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODZkMTU1ZjhlYmE0Y2YxOTliNWI5YiIsImlhdCI6MTY3MDMwMDQ4MCwiZXhwIjoxNjcwMzAyMjgwfQ.V-4XkUivSNx8jEVVxN8zyEgk8zokmbt5J3Wm1hyc_tW0TBkisxvex8yIvXr29v0bcKk9RPovu7kJT9vD1yibYcPKsvQIFcO8zY8bnL5rt0r6Vffc3HqRqjaXskF_UvRa59aWDG_QFe8hT8-NLkKAUYy0jZJhzA7fMecWbKHj3Zkpfl7yMCRbve7BYnuy5hQN4tBsz_pZazdikdAQ33KD5GZc3ZsqPtdjDHtD_T_xA3LLF1oWoWa-Y9HV09Bj4O8uYNwKH5N1mUJtQD1R-UWpdRNZ8gad5Z3UVgkFBry2Ka-Y8s-uEJmsRGfy6rLoGTzm4ceDnGjGjiBZWt9oZmojqMXPtOEcpwCpsjdaydYjEoCfmDbNZjxWemR9V5am4YTEDtisaTqt3imzH5rp4plCseHYCkrw4Hd0uFltyvyLpVKrtmvtkHMPoqyQyNlM_C8mxizAOA5ZumqeZ9Drq_1yCNYu7NtnpqIv36E_HC6yieQgCV9s3UiIokHev4Dn5eo2s-Z0nBJf2n0qPIVIPD2fHy5FAN7L8YQR5F_ahLcKUP2uW4OFyZyIW8Why-iieY9N864ZKO0LapbtFb2xLcBWyZYe4J13CnyZY3uO4sYm4IfLG4NLrw7aHMXgCNutJnHoIpV6ILp-9c0j9u-SaZMoOd_wmIEyGwYCQRN1WncPzys";
        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }

    // build update gamer REST API
    @PutMapping("/edit/{id}")
    public ResponseEntity<GamerInfo> updateGamerPassword(@PathVariable("id") long id, @RequestBody User user) {
//        return new ResponseEntity<>(service.updatePassword(id, user.getPassword()), HttpStatus.OK);
        return null;
    }

    // reset password
    @PostMapping("/reset_password")
    public String resetPasswordProgress(@RequestBody ResetPasswordRequest request) {
        return resetPasswordService.resetPassword(request);
    }

    @PutMapping("/change_password")
    public String changePassword(@RequestBody ChangePasswordRequest request) {
        return resetPasswordService.changePassword(request);
    }



}
