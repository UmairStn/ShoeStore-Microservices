package com.ead.user_auth_service.controller;

import com.ead.user_auth_service.services.UserService;
import com.ead.user_auth_service.entity.User;
import com.ead.user_auth_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    //register route
    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
//        return userService.createUser(user);
    }
    //update route
    @PostMapping("/auth/update")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }
    //login rout
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        User user = userService.loginUser(username, password);
        if (user != null) {
            String token = jwtUtil.generateToken(user.getUsername());
            String welcomeMessage = "Welcome back, " + user.getFirstName() + "!";
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", user,
                    "message", welcomeMessage
            ));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }



}
