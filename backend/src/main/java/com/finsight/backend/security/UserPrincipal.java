package com.finsight.backend.security;

public class UserPrincipal {
    private final Long userId;

    public UserPrincipal(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }
}

