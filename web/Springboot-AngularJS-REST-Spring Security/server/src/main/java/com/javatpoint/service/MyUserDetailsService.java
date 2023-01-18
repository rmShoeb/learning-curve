package com.javatpoint.service;

import com.javatpoint.model.MyUserDetails;
import com.javatpoint.model.UserInfo;
import com.javatpoint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    public MyUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserInfo> user = userRepository.findByUserName(username);
        user.orElseThrow(()->new UsernameNotFoundException(username+" not found"));
        return user.map(MyUserDetails::new).get();
    }
}
