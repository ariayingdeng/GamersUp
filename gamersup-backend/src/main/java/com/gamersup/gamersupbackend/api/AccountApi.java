package com.gamersup.gamersupbackend.api;

import com.gamersup.gamersupbackend.model.account.*;
import com.gamersup.gamersupbackend.model.profile.GamerInfo;
import com.gamersup.gamersupbackend.service.account_service.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("api/account")
@AllArgsConstructor
@CrossOrigin(origins="http://localhost:5252")
public class AccountApi {

    @Autowired
    private CustomAuthenticationProvider customAuthenticationProvider;

//    @Autowired
//    private CustomUserDetailsService customUserDetailsService;

    private final UserService userService;
    private final RegistrationService registrationService;
    private final ResetPasswordService resetPasswordService;

    @PostMapping("/create")
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        return new ResponseEntity<>(userService.saveUser(user), HttpStatus.CREATED);
    }

    @PostMapping("/registration")
    public String register(@RequestBody RegistrationRequest request) {
        return registrationService.register(request);
    }

    @GetMapping(path = "/confirm")
    public RedirectView confirm(@RequestParam("token") String token) {
        registrationService.confirmToken(token);
        return new RedirectView("http://localhost:5252/login");
    }

    @PostMapping("/authenticate")
    public ResponseEntity<Boolean> createAuthenticationToken(@RequestBody LoginRequest request) throws Exception{
//        User user = userService.getUserByEmail(request.getEmail());
//        if (userService.checkPassword(user, request.getPassword())) {
//            return new ResponseEntity<>(true, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(false, HttpStatus.UNAUTHORIZED);
//        }

        try {
            customAuthenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),
                    request.getPassword()));
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (BadCredentialsException ex) {
            throw ex;
        }

//        UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getEmail());
//        final String jwt = jwtUsernameAndPasswordAuthenticationFilter.generateToken(userDetails);
//        String jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODZkMTU1ZjhlYmE0Y2YxOTliNWI5YiIsImlhdCI6MTY3MDMwMDQ4MCwiZXhwIjoxNjcwMzAyMjgwfQ.V-4XkUivSNx8jEVVxN8zyEgk8zokmbt5J3Wm1hyc_tW0TBkisxvex8yIvXr29v0bcKk9RPovu7kJT9vD1yibYcPKsvQIFcO8zY8bnL5rt0r6Vffc3HqRqjaXskF_UvRa59aWDG_QFe8hT8-NLkKAUYy0jZJhzA7fMecWbKHj3Zkpfl7yMCRbve7BYnuy5hQN4tBsz_pZazdikdAQ33KD5GZc3ZsqPtdjDHtD_T_xA3LLF1oWoWa-Y9HV09Bj4O8uYNwKH5N1mUJtQD1R-UWpdRNZ8gad5Z3UVgkFBry2Ka-Y8s-uEJmsRGfy6rLoGTzm4ceDnGjGjiBZWt9oZmojqMXPtOEcpwCpsjdaydYjEoCfmDbNZjxWemR9V5am4YTEDtisaTqt3imzH5rp4plCseHYCkrw4Hd0uFltyvyLpVKrtmvtkHMPoqyQyNlM_C8mxizAOA5ZumqeZ9Drq_1yCNYu7NtnpqIv36E_HC6yieQgCV9s3UiIokHev4Dn5eo2s-Z0nBJf2n0qPIVIPD2fHy5FAN7L8YQR5F_ahLcKUP2uW4OFyZyIW8Why-iieY9N864ZKO0LapbtFb2xLcBWyZYe4J13CnyZY3uO4sYm4IfLG4NLrw7aHMXgCNutJnHoIpV6ILp-9c0j9u-SaZMoOd_wmIEyGwYCQRN1WncPzys";
//        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }

    @PostMapping("/login/google")
    public ResponseEntity<Boolean> loginGoogleUser(@RequestBody GoogleLoginRequest request) throws Exception {
        try {
            userService.loginGoogleUser(request.getName(), request.getEmail(), request.getAvatarUrl());
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(false, HttpStatus.UNAUTHORIZED);
        }
    }

    // build update gamer REST API
    @PutMapping("/edit/{id}")
    public ResponseEntity<GamerInfo> updateGamerPassword(@PathVariable("id") long id, @RequestBody User user) {
//        return new ResponseEntity<>(service.updatePassword(id, user.getPassword()), HttpStatus.OK);
        return null;
    }

    // reset password
    @PostMapping("/forgot/password")
    public Boolean forgotPasswordProgress(@RequestBody ForgotPasswordRequest request) {
        return resetPasswordService.sendForgotPasswordEmail(request);
    }

    @PutMapping("/change/password")
    public ResponseEntity<Boolean> changePasswordWithCurrentPassword(@RequestBody ChangePasswordWithCurrentPassRequest request) {
        if (resetPasswordService.changePassword(request)) {
            return  new ResponseEntity<>(true, HttpStatus.OK);
        }
        return new ResponseEntity<>(false, HttpStatus.UNAUTHORIZED);
    }



}
