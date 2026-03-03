package com.authen.authen.Exceptions;


public class PhoneNumberNotFoundException extends RuntimeException {

    public PhoneNumberNotFoundException(String message) {
        super(message);
    }
}