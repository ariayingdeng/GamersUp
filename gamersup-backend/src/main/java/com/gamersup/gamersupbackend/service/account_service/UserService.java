package com.gamersup.gamersupbackend.service.account_service;

import com.gamersup.gamersupbackend.model.account.Provider;
import com.gamersup.gamersupbackend.model.account.User;
import com.gamersup.gamersupbackend.model.exception.ResourceNotFoundException;
import com.gamersup.gamersupbackend.model.profile.GamerInfo;
import com.gamersup.gamersupbackend.repo.UserRepository;
import com.gamersup.gamersupbackend.service.GamerService;
import com.gamersup.gamersupbackend.service.email_service.token.ConfirmationToken;
import com.gamersup.gamersupbackend.service.email_service.token.ConfirmationTokenService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    private UserRepository userRepository;

    private GamerService gamerService;
    private final ConfirmationTokenService confirmationTokenService;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public boolean checkPassword(User user, String rawPassword) {
        if(passwordEncoder.matches(rawPassword, user.getPassword())) {
            return true;
        }
        return false;
    }

    public void loginGoogleUser(String name, String email, String avatarUrl) {
        Optional<User> user = userRepository.findByEmail(email);
        if (!user.isPresent()) {
            User newUser = new User();
            newUser.setName(name);
            newUser.setEmail(email);
            newUser.setProvider(Provider.GOOGLE);
            newUser.setEnable(true);

            userRepository.save(newUser);
            gamerService.saveGamer(new GamerInfo(email, name, avatarUrl));
        } else {
            // update name and avatarUrl
            User theUser = user.get();
            theUser.setName(name);
            userRepository.save(theUser);

            gamerService.changeAvatarByEmail(email, avatarUrl);
        }
    }

    public String signUpUser(User user) {
        boolean userExists = userRepository.findByEmail(user.getEmail()).isPresent();
        if (userExists) {
            // TODO check of attributes are the same
            // TODO if email not confirmed send confirmation email


            throw new IllegalStateException("Email already taken");
        }
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        user.setProvider(Provider.LOCAL);
        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        // TODO: Send confirmation token
        ConfirmationToken confirmationToken = new ConfirmationToken(
                token, LocalDateTime.now(), LocalDateTime.now().plusMinutes(15), user
        );

        confirmationTokenService.saveConfirmationToken(confirmationToken);


        // TODO: Send Email

        return token;
    }

    public int enableUser(String email) {
        return userRepository.enableUser(email);
    }

    public void updatePassword(User user, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    public void updateName(User user, String name) {
        user.setName(name);
        userRepository.save(user);
    }

    public void updateEmail(User user, String email) {
        user.setEmail(email);
        userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->
                new ResourceNotFoundException("User", "Email", email)
        );
    }

    public User getUserById(long id) {
        return userRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("User", "ID", id)
        );
    }
}
