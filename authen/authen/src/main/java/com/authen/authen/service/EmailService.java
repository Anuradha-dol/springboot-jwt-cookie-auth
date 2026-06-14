package com.authen.authen.service;

import com.authen.authen.records.AuthRecords;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {


    private final JavaMailSender javaMailSender;


    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendSimpleMessasge(AuthRecords.MailBody mailBody) {


        SimpleMailMessage message= new SimpleMailMessage();
        message.setTo(mailBody.to());
        message.setFrom("anuradhawork123@gmail.com");
        message.setSubject(mailBody.subject());
        message.setText(mailBody.text());


        javaMailSender.send(message);
    }
}
